<#
  Deploys the Azure Functions API and the React SPA to the already-provisioned Azure
  resources (see infra/main.bicep). Meant to be run from Azure Cloud Shell in
  PowerShell mode, from the project root, after uploading/expanding the repo there.
  Cloud Shell is already signed in via its own `az login` - no credentials needed.

  Usage (from the project root):
    .\scripts\deploy-azure.ps1
    .\scripts\deploy-azure.ps1 -SkipFrontend        # API only
    .\scripts\deploy-azure.ps1 -SkipApi             # frontend only
    .\scripts\deploy-azure.ps1 -ResourceGroup rg-bi-viz-accelerator -StorageAccount bivizstyq67gc2er6uww -FunctionApp biviz-api

  Why not `func azure functionapp publish` / `az functionapp deployment source
  config-zip`: this plan's Function App doesn't support the classic zip-push path
  ("configure the app to deploy from a remote package" error), and `func publish`'s
  TypeScript auto-detection tries to `npm install -g typescript`, which fails with
  EACCES in Cloud Shell. This script instead uploads the already-built package to a
  private blob and points WEBSITE_RUN_FROM_PACKAGE at it directly.
#>

param(
  [string]$ResourceGroup = 'rg-bi-viz-accelerator',
  [string]$StorageAccount = 'bivizstyq67gc2er6uww',
  [string]$FunctionApp = 'biviz-api',
  [switch]$SkipApi,
  [switch]$SkipFrontend
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not $SkipApi) {
  Write-Host "=== Deploying API ===" -ForegroundColor Cyan

  Set-Location (Join-Path $root 'api')
  npm install
  npm run build

  $zipPath = Join-Path $root 'api-deploy.zip'
  if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

  Write-Host "Packaging dist/, node_modules/, host.json, package.json..."
  Compress-Archive -Path 'dist', 'node_modules', 'host.json', 'package.json' -DestinationPath $zipPath -CompressionLevel Optimal

  Set-Location $root

  $blobName = "api-deploy-$(Get-Date -Format 'yyyyMMddHHmmss').zip"

  Write-Host "Ensuring the 'deployments' container exists..."
  az storage container create `
    --account-name $StorageAccount --auth-mode login `
    --name deployments --output none

  Write-Host "Uploading $blobName..."
  az storage blob upload `
    --account-name $StorageAccount --auth-mode login `
    -c deployments -n $blobName -f $zipPath --output none

  $storageKey = (az storage account keys list `
    --account-name $StorageAccount `
    --resource-group $ResourceGroup `
    --query "[0].value" -o tsv).Trim()

  # WEBSITE_RUN_FROM_PACKAGE is re-read on every cold start/scale-out, so this can't
  # be a short-lived token - a 7-day user-delegation SAS (--auth-mode login) won't do.
  $expiry = (Get-Date).ToUniversalTime().AddYears(10).ToString('yyyy-MM-ddTHH:mmZ')

  # --full-uri returns the complete blob URL with the SAS token already appended, so
  # there's no manual "$blobUrl?$sas" concatenation to get wrong (a stray newline from
  # -o tsv output ending up mid-string is exactly what produces "invalid value" here).
  $packageUrl = (az storage blob generate-sas `
    --account-name $StorageAccount --account-key $storageKey `
    -c deployments -n $blobName `
    --permissions r --https-only --expiry $expiry --full-uri -o tsv).Trim()

  Write-Host "Pointing $FunctionApp at the new package..."
  az functionapp config appsettings set `
    --resource-group $ResourceGroup --name $FunctionApp `
    --settings "WEBSITE_RUN_FROM_PACKAGE=$packageUrl" --output none

  Write-Host "Restarting $FunctionApp..."
  az functionapp restart --resource-group $ResourceGroup --name $FunctionApp --output none

  Write-Host "Waiting for the app to come back up (cold start on this plan can take a while)..."
  $body = @{ email = 'powerbi.admin@ideas2it.com'; password = 'biviz2026@i2i' } | ConvertTo-Json
  $maxAttempts = 12
  $succeeded = $false

  for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    Start-Sleep -Seconds 10
    try {
      $response = Invoke-RestMethod -Uri "https://$FunctionApp.azurewebsites.net/api/auth/login" `
        -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 15
      Write-Host "API check OK: signed in as $($response.email) ($($response.role))" -ForegroundColor Green
      $succeeded = $true
      break
    } catch {
      # A 503 or an HTML error page during cold start throws here too (not just a
      # non-2xx status) - Invoke-RestMethod can't parse HTML as the JSON it expects.
      Write-Host "  Attempt $attempt/$maxAttempts not ready yet, retrying..."
    }
  }

  if (-not $succeeded) {
    Write-Warning "API check still failing after $($maxAttempts * 10)s. It may need more time, or the deploy may have a real problem - check with: az functionapp show --resource-group $ResourceGroup --name $FunctionApp --query state"
  }
}

if (-not $SkipFrontend) {
  Write-Host "=== Deploying frontend ===" -ForegroundColor Cyan

  Set-Location $root

  # Vite reads this automatically for `npm run build` (mode=production). Without it,
  # VITE_API_BASE_URL is undefined, apiFetch() falls back to relative paths, and every
  # API call resolves against the static website's own origin instead of the Function
  # App - which only serves GET, so POSTs like /api/auth/login come back 405.
  Write-Host "Writing .env.production (VITE_API_BASE_URL -> $FunctionApp)..."
  "VITE_API_BASE_URL=https://$FunctionApp.azurewebsites.net" | Out-File -FilePath .env.production -Encoding utf8 -NoNewline

  npm install
  npm run build

  Write-Host "Uploading dist/ to `$web..."
  az storage blob upload-batch `
    --account-name $StorageAccount --auth-mode login `
    -d '$web' -s dist --overwrite --output none
}

Write-Host "Done." -ForegroundColor Green
