# Azure Deployment Runbook

This is the step-by-step path from "code in this repo" to "running on Azure." Every
command here is **PowerShell** (matching a standard Windows dev setup) and meant to be
copy-pasted and run from your own machine/CI with your own Azure credentials — none of
this was executed on your behalf. If you're on Bash/Git Bash/WSL instead, the only
things that change are variable assignment (`$VAR = cmd` → `` VAR=$(cmd) ``) and line
continuation (`` ` `` → `\`) — every `az` flag and argument is identical either way.

Architecture recap (see [architecture.md](architecture.md) for the full picture):
React SPA on **Blob Storage static website** → **Azure Functions** → **Table Storage**
(trainee data) + **Blob Storage** (course content). Auth is a `Users` table you
populate directly (see below) — there's no Entra ID/Easy Auth step in this runbook by
design; see architecture.md's Auth section for how to re-introduce it if you need to.

## 0. Prerequisites

- An Azure subscription. Azure CLI (`az`) logged in: `az login`, then `az account set --subscription <id>`.
- Azure Functions Core Tools (`npm install -g azure-functions-core-tools@4`) for
  deploying the API from the CLI, or use the GitHub Actions workflow instead (§4).
- Node.js 20+.
- Run every command below from the project root (`powerbi-accelerator/`) —
  `Get-Location` should show that path before you start. A wrong starting directory is
  the #1 cause of "file not found" errors with the relative paths used here.

## 1. Deploy the infrastructure

```powershell
az group create -n rg-bi-viz-accelerator -l eastus

# staticWebsiteOrigin can't be known yet — the storage account it depends on doesn't
# exist until this deployment creates it. Deploy once with the placeholder from
# infra/main.parameters.json (harmless: nothing calls the API cross-origin yet), then
# redeploy with the real value once you have it (step 2).
az deployment group create `
  -g rg-bi-viz-accelerator `
  -f infra/main.bicep `
  -p "@infra/main.parameters.json"
```

This provisions the Storage Account (Tables + Blob containers, including the `Users`
table), the Function App on a Consumption plan with a system-assigned Managed
Identity, its `Storage Blob/Table Data Contributor` role assignments, and Application
Insights. See `infra/main.parameters.json` for a fillable parameters file.

**Note on identity-based `AzureWebJobsStorage`**: the template grants the Function
App's identity Blob/Table Data Contributor for the app's own data. If the Functions
host itself has trouble with lock/lease blobs under identity-based `AzureWebJobsStorage`,
grant `Storage Blob Data Owner` too — I couldn't exercise this specific path against a
real Azure deployment from this sandbox, only against Azurite locally, so verify it on
first deploy.

## 2. Enable the static website + upload the SPA

Bicep can't declaratively flip on Blob Storage's static-website feature as of today, so
this one step is CLI-only:

```powershell
$STORAGE_ACCOUNT = az deployment group show -g rg-bi-viz-accelerator -n main --query properties.outputs.storageAccountName.value -o tsv

az storage blob service-properties update `
  --account-name $STORAGE_ACCOUNT --auth-mode login `
  --static-website --index-document index.html --404-document index.html

$STATIC_SITE_URL = az storage account show -n $STORAGE_ACCOUNT --query "primaryEndpoints.web" -o tsv
Write-Host "Static site: $STATIC_SITE_URL"
```

Re-run the step-1 deployment, this time overriding just that one parameter so the
Function App's CORS setting actually matches your real static site:

```powershell
az deployment group create `
  -g rg-bi-viz-accelerator `
  -f infra/main.bicep `
  -p "@infra/main.parameters.json" `
  -p staticWebsiteOrigin=$STATIC_SITE_URL
```

Build and upload the frontend:

```powershell
$FUNCTION_APP = az deployment group show -g rg-bi-viz-accelerator -n main --query properties.outputs.functionAppName.value -o tsv

"VITE_API_BASE_URL=https://${FUNCTION_APP}.azurewebsites.net" | Out-File -FilePath .env.production -Encoding utf8

npm run build
az storage blob upload-batch `
  --account-name $STORAGE_ACCOUNT --auth-mode login `
  -d '$web' -s dist --overwrite
```

(`'$web'` stays literal in both PowerShell and Bash single quotes — it's the actual,
fixed container name Azure uses for static website content, not a variable.)

## 3. Seed course content and users

```powershell
cd api
npm install
npm run build

$env:STORAGE_ACCOUNT_NAME = $STORAGE_ACCOUNT
npm run seed:course
# Seeds the admin (powerbi.admin@ideas2it.com) + 8 demo trainees into the Users table,
# plus a realistic demo cohort of progress/quizzes/submissions for them.
npm run seed:demo
```

These scripts use `DefaultAzureCredential`, so they authenticate as *you* (via `az
login`) — grant yourself `Storage Blob Data Contributor` + `Storage Table Data
Contributor` on the storage account first if you get a 403:

```powershell
$MY_OID = az ad signed-in-user show --query id -o tsv
$STORAGE_ID = az storage account show -n $STORAGE_ACCOUNT --query id -o tsv
az role assignment create --assignee $MY_OID --role "Storage Blob Data Contributor" --scope $STORAGE_ID
az role assignment create --assignee $MY_OID --role "Storage Table Data Contributor" --scope $STORAGE_ID
```

### Adding real Ideas2IT users

`powerbi.admin@ideas2it.com` always works as ADMIN even with no table row (a bootstrap
fallback — see `api/src/services/userService.ts`). For everyone else, add a row to the
`Users` table directly — no redeploy needed, it's read fresh on every login/`/api/me`
call. Easiest via the Portal's **Storage browser** on the storage account → Tables →
`Users` → Add entity, or from the CLI:

```powershell
az storage entity insert --auth-mode login --account-name $STORAGE_ACCOUNT `
  --table-name Users `
  --entity PartitionKey=USER RowKey=firstname.lastname@ideas2it.com `
    id=firstname.lastname@ideas2it.com email=firstname.lastname@ideas2it.com `
    name="Firstname Lastname" role=TRAINEE avatarInitials=FL `
    joinedAt=2026-01-01T00:00:00.000Z cohort=BI-Visualization-Accelerator-2026-Q1
```

Use `role=ADMIN` (and drop `cohort`) for another admin, or `role=MANAGER` (and drop
`cohort`, keep `title`) for a **read-only** admin-console viewer — a Manager can see
everything under Admin (cohort dashboard, trainees, reports, submissions, course
content) but every create/update/delete endpoint (evaluations, at-risk thresholds,
course/quiz/assignment editing) is rejected server-side regardless of what the UI
shows, enforced in `api/src/functions/admin.ts` and `courseAdmin.ts`. Example:

```powershell
az storage entity insert --auth-mode login --account-name $STORAGE_ACCOUNT `
  --table-name Users `
  --entity PartitionKey=USER RowKey=manager@ideas2it.com `
    id=manager@ideas2it.com email=manager@ideas2it.com `
    name="Program Manager" role=MANAGER avatarInitials=PM `
    joinedAt=2026-01-01T00:00:00.000Z title="Program Manager"
```

(`role` casing is normalized on read as of the latest API deploy, so
`Trainee`/`trainee`/`TRAINEE` all work the same — but match this exact casing for
consistency with what's already in the table.)

Every user — seeded or manually inserted like this — starts with the default
password **`biviz2026@i2i`** (see `api/src/auth/password.ts`); it isn't part of the
entity you insert above, it's applied automatically the first time that row logs in.
Trainees and admins should use **Change Password** in the account menu after signing
in for the first time.

## 4. Deploy the API code

```powershell
cd api
func azure functionapp publish $FUNCTION_APP
```

Or use `.github/workflows/deploy.yml` (already in this repo) for CI/CD instead — it
builds and deploys both the SPA and the Functions app on every push to `main`. It needs
these repo secrets: `AZURE_CLIENT_ID`/`AZURE_TENANT_ID`/`AZURE_SUBSCRIPTION_ID`
(federated OIDC login — preferred over a stored secret), plus `VITE_API_BASE_URL` and
the storage account/function app names as repo variables.

## 5. Verify

- Open `$STATIC_SITE_URL` → `/login` → sign in with `powerbi.admin@ideas2it.com` (or
  any email you've seeded) and the default password `biviz2026@i2i` → lands on the
  right dashboard for that account's role.
- Use the account menu's **Change Password** to set a real password, sign out, and
  confirm the old default password no longer works but the new one does.
- Confirm a wrong password, or an email with no `Users` row (and not the default
  admin), gets a clear "Invalid email or password" error, not a crash.
- Walk the section-37 acceptance flow end-to-end for real: study → exercise → GitHub
  submit → quiz → assignment → admin evaluate → notification → CSV export.

## Cost

Same shape as the earlier "cheapest options" comparison: Blob static website hosting is
pennies/month at this size, Table/Blob Storage for trainee + course data is a few cents
a month for a cohort this size, and the Functions Consumption plan is pay-per-execution
— realistically low-single-digits USD/month total for an internal cohort of dozens of
trainees. Application Insights' free tier (5 GB/month) comfortably covers this too.
