# Data Model

All types live under `src/domain/*.ts` (barrel: `src/domain/index.ts`). Nothing here is
Power BI-specific except the seed *content* — see [architecture.md](architecture.md#reusable-course-design).

## Course content hierarchy

```
Course (course.ts)
 └─ CourseModule ("week")
     └─ LearningDay
         ├─ StudyMaterial   (1:1, via LearningDay.studyMaterialId)
         ├─ Exercise        (1:1, via LearningDay.exerciseId)
         ├─ Quiz            (1:1, via LearningDay.quizId) ── QuizQuestion[]
         └─ Assignment      (0:1, via LearningDay.assignmentId — optional; Day 10 has none)
```

- `Course { id, slug, title, description, totalDays, totalHours, isPublished }`
- `CourseModule { id, courseId, weekNumber, title }`
- `LearningDay { id, courseId, moduleId, dayNumber, weekNumber, title, description, theoryHours, labHours, learningObjectives: string[], studyMaterialId, exerciseId, quizId, assignmentId?, isPublished }`
- `StudyMaterial { id, dayId, title, markdownContent, resources: StudyResource[] }` — `StudyResource { label, url }`
- `Exercise { id, dayId, title, objective, businessScenario, dataset, requirements: string[], expectedOutcome, hints: string[], acceptanceCriteria: string[] }`
- `Quiz { id, dayId, title, passingScorePercent, maxAttempts, questions: QuizQuestion[] }`
- `QuizQuestion { id, quizId, question, options: [string,string,string,string], correctOptionIndex: 0|1|2|3, explanation, difficulty: 'EASY'|'MEDIUM'|'HARD', topic }`
- `Assignment { id, dayId, title, objective, businessContext, requirements: string[], deliverables: string[], submissionInstructions, evaluationCriteria: string[] }`
- `Capstone { id, key, title, customerContext, dataTables: string[], kpis: string[], pages: string[], pageContent: string[], acceptanceCriteria: string[] }` — the 3 Day 10 capstone options; not attached to a specific day record beyond Day 10's exercise referencing all three.

## People

- `User { id, name, email, role: 'ADMIN'|'TRAINEE', avatarInitials, joinedAt }`
- `Trainee extends User { role: 'TRAINEE', cohort }`
- `Admin extends User { role: 'ADMIN', title }`

## Progress & activity

- `LearningProgress { traineeId, dayId, studyCompleted, exerciseStarted, exerciseCompleted, quizCompleted, quizScorePercent, quizAttempts, githubSubmitted, assignmentSubmitted, lastUpdatedAt }` — **stored** per (trainee, day).
- `DerivedDayProgress extends LearningProgress { overallStatus: 'NOT_STARTED'|'IN_PROGRESS'|'COMPLETED', completionPercent }` — **computed**, never stored (see `services/logic/deriveProgress.ts`). A day with no `assignmentId` (Day 10) excludes `assignmentSubmitted` from the denominator.
- `TraineeSummary { traineeId, overallCompletionPercent, quizAveragePercent, assignmentsCompleted/Total, exercisesCompleted/Total, daysCompleted, totalDays, lastActiveAt, isAtRisk, atRiskReasons: string[] }` — the cohort-dashboard/Trainee-360 rollup, computed by `progressService.getTraineeSummary()`.
- `AtRiskThresholds { minProgressPercent, inactivityDays, minQuizAveragePercent, maxOverdueAssignments, gracePeriodDays }` — admin-configurable, drives `services/logic/atRisk.ts`. `gracePeriodDays` (default 1) suppresses every at-risk reason until that many days after the trainee's `joinedAt` — otherwise a cohort's first day would flag everyone at 0% progress.
- `ActivityEvent { id, traineeId, type: ActivityEventType, dayId, metadata, timestamp }` — append-only log; `ActivityEventType` = `LOGIN | STUDY_STARTED | STUDY_COMPLETED | EXERCISE_STARTED | EXERCISE_COMPLETED | QUIZ_STARTED | QUIZ_COMPLETED | ASSIGNMENT_SUBMITTED | GITHUB_SUBMITTED | EVALUATION_COMPLETED | COURSE_COMPLETED`.
- `Notification { id, userId, type: NotificationType, title, message, link, isRead, createdAt }`.

## Assessment & submissions

- `QuizAttempt { id, quizId, traineeId, attemptNumber, answers: QuizAnswer[], correctCount, totalQuestions, scorePercent, passed, startedAt, completedAt }` — `QuizAnswer { questionId, selectedOptionIndex }`.
- `GithubSubmission { id, traineeId, contextType: 'EXERCISE'|'ASSIGNMENT'|'CAPSTONE', contextId, repoUrl, branch, commitOrPrUrl, comments, status: SubmissionStatus, submittedAt, updatedAt }`.
- `AssignmentSubmission { id, assignmentId, traineeId, notes, githubRepoUrl, submittedAt, status: SubmissionStatus, score, maxScore, feedback, evaluatedAt }`.
- `SubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'PASSED' | 'NEEDS_IMPROVEMENT'`.
- `Evaluation { id, traineeId, dayId, contextType: 'EXERCISE'|'ASSIGNMENT'|'GITHUB'|'CAPSTONE', contextId, score, maxScore, status, feedback, evaluatorId, evaluatedAt }` — written whenever an admin evaluates a `GithubSubmission` or `AssignmentSubmission`; also triggers a `Notification` and an `EVALUATION_COMPLETED` activity event.

## Where it's all stored

- **Azure Table Storage** (`api/src/repositories/table/*.ts`) — one table per
  per-trainee/per-user collection above: `Progress` (+ a denormalized `ProgressByDay`
  index for cohort queries), `QuizAttempts`, `GithubSubmissions`,
  `AssignmentSubmissions`, `Evaluations`, `Activity`, `Notifications`, and `Users`
  (both admins and trainees, PK=`USER`/RK=`id`, looked up by email at login — see
  architecture.md's Auth section). PartitionKey/RowKey choices are driven by the app's
  actual query
  patterns — see the comments in each repository file, e.g. `GithubSubmissions`/
  `AssignmentSubmissions` key on `(traineeId, id)` so an admin's "evaluate by submission
  id" call is a point lookup, while `Activity`/`Notifications` use an inverted-timestamp
  or plain-id RowKey depending on whether "newest N" or "point update by id" matters
  more for that table.
- **Azure Blob Storage** (`api/src/repositories/blob/*.ts`) — course content
  (`course.json`, `days.json`, `study-materials.json`, `exercises.json`,
  `quizzes.json`, `assignments.json`, `capstones.json`) and `settings/
  at-risk-thresholds.json`, all in the `course-content` container as whole-collection
  JSON documents (small enough at this scale that read-modify-write-the-whole-array is
  simpler than per-item blobs). Lab datasets/images live in the separate, publicly
  readable `datasets` container.
- `src/data/seed/*.ts` (the original course-content authoring + demo-trainee generator)
  isn't a runtime dependency anymore — it's the input to `api/scripts/seed-course-content.ts`
  and `api/scripts/seed-demo-trainees.ts`, one-time migration scripts that upload the
  same content/demo data into Table/Blob Storage. See
  [azure-deployment.md](azure-deployment.md).
