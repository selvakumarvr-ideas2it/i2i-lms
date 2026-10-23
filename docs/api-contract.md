# API Contract

This is the real, implemented contract — every route below exists in `api/src/functions/*.ts`
and is called by the matching `src/services/*.ts` file on the frontend (via
`src/services/http.ts#apiFetch`). Every route except `POST /api/auth/login` expects the
four `x-user-*` identity headers (see [architecture.md](architecture.md)'s Auth
section) — they're trusted outright, not cryptographically verified. Role/ownership
checks beyond "is a header present" are enforced in each handler. `POST
/api/auth/change-password` expects the headers (it needs to know who's asking) but not
a password on top of them.

Conventions: all bodies/responses are JSON. Trainee-scoped routes use
`requireSelfOrAdmin` — a trainee may only act on their own `traineeId`, an admin may act
on anyone's. `{traineeId}` is the `id` field of that user's row in the `Users` table.

## Course content — `api/src/functions/course.ts` (any signed-in user, read-only)

| Method & route | Service function |
|---|---|
| `GET /api/course` | `courseService.getCourse` |
| `GET /api/course/modules` | `getModules` |
| `GET /api/course/days` | `getDays` |
| `GET /api/course/days/{id}` | `getDay` |
| `GET /api/study-materials[/{id}]` | `getStudyMaterials` / `getStudyMaterial` |
| `GET /api/exercises[/{id}]` | `getExercises` / `getExercise` |
| `GET /api/quizzes[/{id}]` | `getQuizzes` / `getQuiz` |
| `GET /api/assignments[/{id}]` | `getAssignments` / `getAssignment` |
| `GET /api/capstones` | `getCapstones` |

## Course admin — `api/src/functions/courseAdmin.ts` (ADMIN only)

| Method & route | Body | Service function |
|---|---|---|
| `PATCH /api/manage/course/days/{id}` | `Partial<LearningDay>` | `updateDay` |
| `PATCH /api/manage/course/days/{id}/publish` | `{isPublished}` | `setDayPublished` |
| `PATCH /api/manage/study-materials/{id}` | `Partial<StudyMaterial>` | `updateStudyMaterial` |
| `PATCH /api/manage/exercises/{id}` | `Partial<Exercise>` | `updateExercise` |
| `PATCH /api/manage/quizzes/{id}` | `Partial<Quiz>` | `updateQuiz` |
| `PATCH /api/manage/assignments/{id}` | `Partial<Assignment>` | `updateAssignment` |

Note the `manage/` segment (not `admin/`) — Azure Functions reserves `admin/` as a
built-in routing namespace even under a custom `routePrefix`; every admin-only route in
this API lives under `/api/manage/*` instead.

## Progress & activity — `api/src/functions/progress.ts`, `activity.ts` (self or admin)

| Method & route | Service function |
|---|---|
| `GET /api/trainees/{traineeId}/progress` | `progressService.getProgressForTrainee` |
| `GET /api/trainees/{traineeId}/progress/derived` | `getDerivedProgressForTrainee` |
| `GET /api/trainees/{traineeId}/progress/{dayId}` | `getProgress` |
| `GET /api/trainees/{traineeId}/summary` | `getTraineeSummary` |
| `GET /api/trainees/{traineeId}/next-day` | `getNextIncompleteDay` |
| `POST /api/trainees/{traineeId}/progress/{dayId}/study-complete` | `markStudyComplete` |
| `POST /api/trainees/{traineeId}/progress/{dayId}/exercise-started` | `markExerciseStarted` |
| `POST /api/trainees/{traineeId}/progress/{dayId}/exercise-completed` | `markExerciseCompleted` |
| `GET /api/trainees/{traineeId}/activity[?limit=]` | `activityService.getActivityForTrainee` |
| `POST /api/trainees/{traineeId}/activity` `{type, dayId?, metadata?}` | `logActivity` — only `LOGIN`/`QUIZ_STARTED` accepted; everything else is a server-side side effect of another call |

## Quiz — `api/src/functions/quiz.ts` (self or admin)

| Method & route | Body | Notes |
|---|---|---|
| `GET /api/trainees/{traineeId}/quizzes/{quizId}/attempts` | — | sorted by attempt number |
| `POST /api/trainees/{traineeId}/quizzes/{quizId}/attempts` | `{dayId, answers}` | scores via `services/logic/quizScoring.ts`, enforces `maxAttempts`, records progress + `QUIZ_COMPLETED` activity server-side; returns `QuizAttempt & {attemptsRemaining}` |

## Submissions — `api/src/functions/submissions.ts` (self or admin)

| Method & route | Body | Notes |
|---|---|---|
| `GET /api/trainees/{traineeId}/github-submissions` | — | all of this trainee's GitHub submissions |
| `GET /api/trainees/{traineeId}/github-submissions/{contextType}/{contextId}` | — | `contextType` = `EXERCISE`\|`ASSIGNMENT`\|`CAPSTONE` |
| `PUT /api/trainees/{traineeId}/github-submissions/{contextType}/{contextId}` | `{repoUrl, branch, commitOrPrUrl, comments, dayId}` | upsert; marks progress + logs `GITHUB_SUBMITTED` |
| `GET /api/trainees/{traineeId}/assignment-submissions[/{assignmentId}]` | — | |
| `PUT /api/trainees/{traineeId}/assignment-submissions/{assignmentId}` | `{notes, githubRepoUrl, dayId}` | upsert; resets score/feedback on resubmit |

## Notifications — `api/src/functions/notifications.ts` (always the authenticated caller)

No route takes a `userId` — there's no "view someone else's notifications" feature, so
the server always scopes to the validated principal's own `oid`.

| Method & route |
|---|
| `GET /api/notifications` |
| `PATCH /api/notifications/{id}/read` |
| `PATCH /api/notifications/read-all` |

## Admin — `api/src/functions/admin.ts` (all under `/api/manage/`)

Every `GET` route here allows both `ADMIN` and `MANAGER` — Manager is a read-only
console viewer. Every mutating route (marked below) is `ADMIN` only; a `MANAGER`
gets a 403 regardless of what the frontend shows, since this is the actual
enforcement boundary (see `docs/architecture.md`'s Auth section).

| Method & route | Roles | Notes |
|---|---|---|
| `GET /api/manage/trainees[?search=&status=]` | ADMIN, MANAGER | `status`: `ALL`\|`AT_RISK`\|`COMPLETED`\|`ACTIVE` |
| `GET /api/manage/trainees/{id}` | ADMIN, MANAGER | Trainee 360 bundle (404 if not found) |
| `GET /api/manage/at-risk-thresholds` | ADMIN, MANAGER | |
| `PUT /api/manage/at-risk-thresholds` | ADMIN only | |
| `GET /api/manage/cohort/overview` | ADMIN, MANAGER | |
| `GET /api/manage/cohort/daily-completion` | ADMIN, MANAGER | via `progressService.getCohortDailyCompletion` |
| `GET /api/manage/cohort/quiz-performance` | ADMIN, MANAGER | via `progressService.getCohortQuizPerformance` |
| `GET /api/manage/cohort/assignment-status[?dayId=]` | ADMIN, MANAGER | Cohort-wide across all assignment days by default; `dayId` narrows to that one day's assignment (404 if the day doesn't exist, empty breakdown if it has no assignment) |
| `GET /api/manage/github-submissions` | ADMIN, MANAGER | every trainee's submissions |
| `GET /api/manage/assignment-submissions` | ADMIN, MANAGER | every trainee's submissions |
| `PATCH /api/manage/github-submissions/{traineeId}/{submissionId}/evaluate` | ADMIN only | `{status, feedback, dayId, score?, maxScore?}` — writes the submission update + an `Evaluation` + a `FEEDBACK_AVAILABLE` notification in one call. `evaluatorId` in the body is ignored; the authenticated caller's own `oid` is what's recorded. |
| `PATCH /api/manage/assignment-submissions/{traineeId}/{submissionId}/evaluate` | ADMIN only | same shape, for assignment submissions |
| `GET /api/manage/reports/cohort-progress` | ADMIN, MANAGER | pre-shaped rows for the CSV export — the frontend just formats them, no per-trainee fan-out from the browser |

## Search — `api/src/functions/search.ts` (any signed-in user)

| Method & route |
|---|
| `GET /api/search?q=<query>` |

Returns `{type, dayId, dayNumber, dayTitle, title, snippet, contentId}[]` — the frontend
(`src/services/searchService.ts`) maps `contentId` through `ROUTES.*` to build the link,
since the backend has no business knowing frontend route shapes.

## Identity — `api/src/functions/auth.ts`, `me.ts` (no identity headers required for login)

| Method & route | Body | Notes |
|---|---|---|
| `POST /api/auth/login` | `{email, password}` | Verifies the password (salted scrypt hash) against the `Users` table row (case-insensitive email); `powerbi.admin@ideas2it.com` always resolves as `ADMIN` with the default password even with no row. Any row with no stored password (e.g. added via `az storage entity insert`) accepts the default password once and self-heals a real hash. 401 on any mismatch. Returns the `User` (never the password/hash), which the frontend caches and echoes back as `x-user-*` headers on every subsequent request. |
| `POST /api/auth/change-password` | `{currentPassword, newPassword}` | Verifies `currentPassword`, then sets `newPassword` (min. 8 chars) as the caller's own password. 401 if `currentPassword` doesn't match. |
| `GET /api/me` | — | Re-fetches the caller's row from the `Users` table by the `x-user-email` header (fresher than trusting the cached headers wholesale) — used on session restore so a role change made directly in the table takes effect without an explicit sign-out. 401 if the row no longer exists. |
