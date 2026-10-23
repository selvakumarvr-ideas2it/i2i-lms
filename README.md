# BI Visualization Accelerator

An internal Ideas2IT learning platform for the **BI Visualization Accelerator** — a
10-day, 60-hour crash course that takes SQL/full-stack developers to customer-ready
Power BI report developers. The platform is built as a reusable **course delivery
engine** (Course → Module → Learning Day → Study Material / Exercise / Quiz /
Assignment → Submission → Evaluation → Progress), so a future course only needs new
seed content, not a new codebase.

The trainee journey: **Learn → Practice → Take Quiz → Build Exercise → Submit GitHub →
Submit Assignment → Trainer Evaluation → Feedback → Next Day.**
The admin journey: **Cohort → Track → Identify Gaps → Review Submissions → Evaluate →
Feedback → Measure Outcome.**

An **Azure-native serverless** app: the React SPA is a Blob Storage static website,
**Azure Functions** is the REST API, and **Azure Table Storage**
(trainee progress/quizzes/submissions/evaluations/users) + **Azure Blob Storage**
(course content) are the persistence layer — behind repository interfaces so that
persistence layer can later move to PostgreSQL/Cosmos DB without touching the React UI.
Sign-in is email + password against a `Users` table you populate directly, with a
shared default password until each person changes their own (see
[docs/architecture.md](docs/architecture.md)'s Auth section for what that trades off).

## Tech stack

**Frontend** — Vite + React 19 + TypeScript (strict), React Router v7, TanStack Query,
Zustand (toast queue only), React Hook Form + Zod, Tailwind CSS v4 + hand-authored
`src/components/ui/*` on Radix UI (shadcn-style), Recharts, react-markdown, Vitest.

**Backend** (`api/`) — Azure Functions v4 (Node.js + TypeScript), `@azure/data-tables` +
`@azure/storage-blob` + `@azure/identity` (Managed Identity in Azure, no account keys),
esbuild for bundling. Clean repository-interface seam — see
[docs/architecture.md](docs/architecture.md) and [docs/api-contract.md](docs/api-contract.md).

**Infra** — Bicep (`infra/main.bicep`), GitHub Actions (`.github/workflows/deploy.yml`).
Full deployment runbook: [docs/azure-deployment.md](docs/azure-deployment.md).

## Getting started (local dev)

Local dev runs the real backend against **Azurite** (the Azure Storage emulator) —
no Azure subscription needed to develop against.

```bash
# Terminal 1 — storage emulator
npx azurite --location .azurite

# Terminal 2 — API
cd api
npm install
cp local.settings.json.example local.settings.json
npm run build
npm run seed:course              # uploads course content into the emulator's Blob storage
STORAGE_CONNECTION_STRING="UseDevelopmentStorage=true" node dist/scripts/seed-demo-trainees.js
func start                       # http://localhost:7071

# Terminal 3 — frontend
npm install
cp .env.example .env.local
npm run dev                      # http://localhost:5173, proxies /api to :7071
```

Sign in at `/login` with `powerbi.admin@ideas2it.com` (always resolves as admin) or
any of `trainee01@ideas2it.com` … `trainee08@ideas2it.com` from the seed data, using
the default password `biviz2026@i2i` (change it from the account menu after signing in).

Other scripts:

```bash
npm run build     # type-check + production build (frontend)
npm run lint      # oxlint
npm run typecheck # tsc --noEmit
npm test          # vitest (pure logic + validation — unaffected by the backend choice)
```

## Deploying for real

See [docs/azure-deployment.md](docs/azure-deployment.md) for the full runbook:
`az deployment group create` against `infra/main.bicep`, enabling static website
hosting, seeding course content, and adding real Ideas2IT users to the `Users` table.

## Project structure

See [docs/architecture.md](docs/architecture.md) for the full breakdown. In short:

```
src/
  app/          # router, providers, layouts, nav config
  auth/         # AuthContext/AuthProvider, ProtectedRoute, RoleBasedRoute, authService
  domain/       # TypeScript domain models (shared with api/ via relative imports)
  services/     # course/progress/quiz/assignment/submission/admin/activity/notification/search
                # — thin apiFetch() wrappers; services/logic/* is pure and shared with api/
  data/seed/    # original course content + deterministic demo-progress generator
                # (no longer a runtime dependency — see api/scripts/)
  hooks/        # TanStack Query hooks wrapping the services
  components/ui/     # Button, Card, Badge, Dialog, Tabs, Table, ... (shadcn-style)
  components/shared/ # StatusBadge, States (loading/empty/error), MarkdownContent, UserMenu, ...
  features/     # one folder per page/feature (dashboard, learning-path, quiz, admin/*, ...)
api/
  src/functions/     # HTTP-triggered Azure Functions (one file per route group)
  src/services/      # business logic, mirrors src/services/*.ts, reuses src/services/logic/*
  src/repositories/  # interfaces + Table/Blob Storage implementations — the swap seam
  src/container.ts   # composition root
  scripts/           # one-time seed migration scripts
infra/          # Bicep IaC
docs/           # architecture, data model, API contract, user guide, Azure deployment runbook
doc/            # original trainer guide, learner workbook, lab datasets, quiz key, capstones
```

## Documentation

- [docs/architecture.md](docs/architecture.md) — layers, data flow, auth model, the
  repository-interface swap seam
- [docs/data-model.md](docs/data-model.md) — every domain type, Table Storage key design
- [docs/api-contract.md](docs/api-contract.md) — every route, method, body and handler
- [docs/azure-deployment.md](docs/azure-deployment.md) — Bicep deployment runbook
- [docs/user-guide.md](docs/user-guide.md) — how to use the platform as a trainee or admin
