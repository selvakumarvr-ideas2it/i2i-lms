# Architecture

## Overview

```
Browser (React SPA) ──x-user-* headers──▶ Azure Functions (Node.js/TS, HTTP triggers)
     │                                          │  clientPrincipal.ts trusts the headers
     │                                          │  outright (see Auth below)
     │                                          ▼
     │                              api/src/repositories/*.interface.ts  ◀── the swap seam
     │                                          │
     │                              ┌───────────┴───────────┐
     │                              ▼                       ▼
     │                    table/*.ts (Azure Table)   blob/courseContentRepository.ts (Blob)
     │
     └── static files (index.html, JS, CSS) ──▶ Azure Blob Storage $web static website
```

Frontend and backend are two separate deployables (`/` and `/api`) that both import the
same, unchanged pure modules — `src/domain/*.ts` (types) and `src/services/logic/*.ts`
(`deriveProgress`, `atRisk`, `quizScoring`) — via relative paths from `api/`. No
monorepo tooling; the backend just reaches into the frontend's `src/` for these two
directories, and nothing else.

## Frontend layers

```
Feature pages (src/features/**)
        │  useX() hooks only — never call a service directly from a component
        ▼
TanStack Query hooks (src/hooks/*.ts)
        │  cache keys, invalidation, mutation wiring
        ▼
Services (src/services/*.ts)
        │  every function here is now a thin apiFetch() call — see below
        ▼
src/services/http.ts#apiFetch()  →  Azure Functions API (see api-contract.md)
```

- **Feature pages** never import `src/services/*` directly — always through a hook in
  `src/hooks/*`. Nothing in this layer changed when the backend went from `localStorage`
  to real Azure services — that was the point of the seam.
- **Hooks** are unchanged TanStack Query wrappers.
- **Services** (`src/services/*.ts`) are one `apiFetch()` call per exported function,
  hitting the routes documented in [api-contract.md](api-contract.md). `quizService.ts`'s
  `getQuizDraft`/`saveQuizDraft`/`clearQuizDraft` are the one exception left in
  `localStorage` — they're a client-only "resume an in-progress quiz" affordance, never
  meant to be server state.
- **`src/services/http.ts`** (`apiFetch`) is the one place that knows the current user
  (cached from login, see Auth below), attaches the identity headers, and talks to the
  API's base URL.

## Backend layers (`api/`)

```
api/src/functions/*.ts        ← thin HTTP triggers: parse request, call a service, shape response
        │
api/src/services/*.ts         ← business logic, mirrors src/services/*.ts 1:1, reuses
        │                        src/services/logic/* for scoring/derivation/at-risk math
        ▼
api/src/repositories/interfaces.ts   ◀── the ONE seam to swap for PostgreSQL/Cosmos DB
        │
   ┌────┴────┐
   ▼         ▼
table/*.ts  blob/*.ts
(Azure Table Storage,   (Azure Blob Storage,
 trainee data)           course content + settings)
```

- **`api/src/container.ts`** is the composition root: it instantiates every concrete
  repository and wires them into every service. **This is the only file that changes**
  to move off Table/Blob Storage — write new classes implementing the interfaces in
  `repositories/interfaces.ts` and swap them in here. Nothing in `services/*.ts` or
  `functions/*.ts` needs to change, because they only ever depend on the interfaces.
- **Repositories** — see [data-model.md](data-model.md) for the exact Table Storage
  PartitionKey/RowKey design per entity, and why (it's driven by the queries the app
  actually makes, e.g. a denormalized `ProgressByDay` index so the admin cohort
  dashboard's "completion per day" query is a partition scan, not a full table scan).
- **Auth helpers** (`api/src/auth/`) — `clientPrincipal.ts` reads identity straight off
  request headers (see Auth below); `requireRole.ts` enforces role/ownership checks
  (`requireRole(principal, ['ADMIN'])`, `requireSelfOrAdmin(principal, traineeId)`).

## Auth — Users table + header-trust (no Entra ID/Easy Auth)

This started as an Entra ID / Easy Auth design (App Registrations, App Roles, token
validation at the platform level) and was deliberately simplified back to something
closer to the original mock, but now backed by a real, admin-managed Table Storage
table instead of `localStorage`:

- **`Users` table** (`api/src/repositories/table/userRepository.ts`, PK=`USER`,
  RK=`id`) is the single source of truth for who can use the app and what role they
  have. Rows are added directly — via `api/scripts/seed-demo-trainees.ts`, the Azure
  Portal's Storage Browser, or `az storage entity insert` — not auto-provisioned on
  first login. `powerbi.admin@ideas2it.com` always resolves as `ADMIN`
  (`api/src/services/userService.ts`) even with no row at all, as a bootstrap safety
  net so there's always a way into the admin console.
- **`POST /api/auth/login`** (`api/src/functions/auth.ts`) takes `{email, password}`,
  verifies the password against a salted scrypt hash stored on the Users row
  (`api/src/auth/password.ts`; hashes never leave the backend — the `User` shape
  returned to the frontend and cached in `localStorage` has no password field at all),
  and returns the matching `User` or a 401. Every row — seeded, or added directly via
  `az storage entity insert`/the Portal with no password fields at all — starts on the
  shared default password (`DEFAULT_PASSWORD` in `password.ts`) and self-heals a real
  hash on first successful login with it. `POST /api/auth/change-password` (needs the
  caller's current password) lets a signed-in user set their own from then on — see the
  account menu's **Change Password**. There is still no redirect flow; this plus
  change-password is the entire "sign-in."
- **Every subsequent request** carries the resolved identity as plain headers
  (`x-user-id`, `x-user-email`, `x-user-name`, `x-user-role`), set from what login
  returned and cached in `localStorage` (`src/services/http.ts`).
  `api/src/auth/clientPrincipal.ts` trusts these headers outright — **there is no
  cryptographic verification of identity per request**. `GET /api/me` re-fetches the
  Users table row by email on session restore, so a role change made directly in the
  table takes effect on next load.

**This is a real, deliberate security tradeoff**, appropriate for an internal pilot
with synthetic training data on a trusted network — not for anything holding sensitive
data or exposed publicly. The password only gates the initial `POST /api/auth/login`
call; anyone who can reach the API can still set those four headers directly to act as
any user id/role on every later request (e.g. via browser devtools), with no
per-request cryptographic proof of identity. If that ever stops being an acceptable
risk, `clientPrincipal.ts` is the one file to change — re-introduce Entra ID/Easy Auth
(the original design, still fully compatible with the rest of the app since nothing
else depends on how identity is established) or at minimum a signed session token.

## Reusable-course design

Unchanged: the domain model never mentions "Power BI" — it's `Course → CourseModule →
LearningDay → {StudyMaterial, Exercise, Quiz, Assignment}`. A second course is a second
set of JSON documents in the `course-content` Blob container; no code changes. See
[data-model.md](data-model.md).

## State management choices

- **Server state**: TanStack Query, unchanged.
- **Client-only state**: Zustand for the toast queue only.
- **In-progress quiz answers**: `localStorage` draft per `(traineeId, quizId)` — see
  above; this was always meant to stay client-only, migration or not.

## Analytics event stream

`ActivityEvent`s are still logged for every meaningful trainee action, but almost all
of them are now emitted **server-side** as a side effect of the API call that performs
the action (submitting a quiz logs `QUIZ_COMPLETED` from inside
`api/src/services/quizService.ts#submitAttempt`, evaluating a submission logs
`EVALUATION_COMPLETED` from `adminService.ts`, etc.) — a client can't fake having done
something it didn't actually do. Only two events are still client-triggered:
`LOGIN` (a genuine `POST /api/auth/login`, not a page-refresh session restore)
and `QUIZ_STARTED`, both via `POST /api/trainees/{traineeId}/activity`
(`api/src/functions/activity.ts`, which allow-lists exactly those two event types).
