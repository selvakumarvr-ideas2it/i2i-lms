# Build a React SPA — Power BI Crash Course Training Platform

## Role

Act as a **Senior Product Architect, UX Designer and Full-Stack React Engineer**.

Build a production-quality **React Single Page Application (SPA)** called:

**Power BI Developer Accelerator**

This application will be used internally by **Ideas2IT** to train React/full-stack developers and SQL-skilled engineers to become capable Power BI report developers.

The application must be designed as a reusable **corporate learning platform**, but the first course implemented should be:

> **Power BI Crash Course — 10 Days / 60 Hours**

The application should be clean, modern, responsive and suitable for desktop and tablet use.

---

# 1. Primary Goals

The platform must enable trainees to:

1. View daily Power BI study material.
2. Follow a structured 10-day learning path.
3. Complete daily exercises.
4. Take daily quizzes.
5. Submit assignments.
6. Submit their GitHub repository URL for coding/report exercises.
7. Track their own learning progress.
8. View quiz scores and assignment status.
9. Receive evaluation/feedback.

The platform must enable administrators/trainers to:

1. Create/manage trainees.
2. Track daily progress.
3. Track quiz completion and scores.
4. Track exercise completion.
5. Review GitHub repository submissions.
6. Evaluate assignments.
7. Provide feedback.
8. View overall cohort progress.
9. Identify trainees who are falling behind.
10. View individual trainee learning history.

---

# 2. User Roles

Implement two roles:

## ADMIN

Admin can:

* Login
* View Admin Dashboard
* View all trainees
* View trainee progress
* View daily completion
* View quiz scores
* View exercise submissions
* View GitHub repository links
* Review assignments
* Add evaluation comments
* Mark submissions as:

  * Submitted
  * Under Review
  * Passed
  * Needs Improvement
* View cohort analytics
* Manage course content
* Manage daily topics
* Manage quiz questions
* Manage exercises
* Manage assignments

## TRAINEE

Trainee can:

* Login
* View personal dashboard
* View course roadmap
* Open today's lesson
* Read study material
* Complete exercises
* Take quiz
* Submit GitHub repository URL
* Submit assignment
* View scores
* View trainer feedback
* Track completion percentage

---

# 3. Authentication

Implement authentication for Ideas2IT users.

Initial requirement:

Users login using their:

**Ideas2IT email ID**

Example:

`firstname.lastname@ideas2it.com`

Do NOT implement public registration.

Only approved Ideas2IT users should be allowed to access the platform.

Design authentication behind an abstraction so that the initial implementation can use mock/local authentication, but the architecture can later integrate with:

* Microsoft Entra ID / Azure AD
* Google Workspace
* Keycloak
* OAuth/OIDC

Create:

```text
AuthProvider
AuthContext
ProtectedRoute
RoleBasedRoute
```

Example roles:

```text
ADMIN
TRAINEE
```

The UI should display the logged-in user's name, email and role.

---

# 4. Course Structure

Implement the complete 10-day Power BI Developer Accelerator.

## Week 1

### Day 1 — BI Fundamentals & Power BI Architecture

Topics:

* BI fundamentals
* OLTP vs OLAP
* Facts and dimensions
* KPIs
* Power BI ecosystem
* Power BI Desktop
* Business question → KPI → visual
* Basic report creation

Study material:

* Theory
* Examples
* Power BI terminology
* Architecture diagram
* Practical examples

Exercise:

Build a basic Sales Overview report.

Quiz:

5–10 questions.

Assignment:

Map 5 business questions to:

```text
Business Question
↓
KPI
↓
Visual
↓
Required Data
```

---

### Day 2 — Power Query & Data Connectivity

Topics:

* SQL
* CSV
* Excel
* Import
* DirectQuery
* Power Query
* Data cleansing
* Data types
* Null handling
* Merge
* Append
* Transformations

Exercise:

Clean a messy dataset.

Assignment:

Create a Data Quality Report.

---

### Day 3 — Semantic Modelling & Star Schema

Topics:

* Fact tables
* Dimension tables
* Relationships
* Cardinality
* Filter direction
* Date dimension
* Star schema
* Bad vs good data models

Exercise:

Build a Retail Star Schema.

Assignment:

Submit:

* Model diagram
* Relationship rationale
* Validation results

---

### Day 4 — Visualization & Report UX

Topics:

* Choosing the right visual
* KPI cards
* Bar charts
* Line charts
* Tables
* Matrix
* Slicers
* Tooltips
* Conditional formatting
* Layout
* Visual hierarchy
* Accessibility
* Dashboard UX

Exercise:

Build:

```text
Executive Sales Dashboard
+
Sales Analysis Dashboard
```

Assignment:

Perform a 10-point UX review.

---

### Day 5 — DAX Essentials

Topics:

* Measures
* Calculated columns
* SUM
* COUNT
* DISTINCTCOUNT
* DIVIDE
* CALCULATE
* FILTER
* Variables
* Time intelligence
* YTD
* LY
* YoY

Exercise:

Build 10 KPI measures.

Assignment:

Explain 5 DAX measures and reconcile results with SQL.

---

# Week 2

### Day 6 — Rapid Customer Prototyping

Topics:

* Requirement analysis
* Requirement decomposition
* KPI dictionary
* Wireframes
* Customer requirements
* Prototype vs production

Exercise:

Healthcare reporting prototype.

Build 3 pages:

```text
Executive Overview
Provider Analysis
Detail
```

Assignment:

Requirement → KPI → Visual traceability matrix.

---

### Day 7 — Interactive Report Development

Topics:

* Drill-down
* Drill-through
* Bookmarks
* Buttons
* Navigation
* Dynamic titles
* Tooltips
* User journeys

Exercise:

Build an interactive report.

Assignment:

Create 10 user-journey test cases.

---

### Day 8 — Claude-Assisted BI Development

Topics:

* Requirement analysis using Claude
* DAX generation
* SQL → DAX
* SQL → Power Query
* UX review
* DAX debugging
* AI validation
* Prompt engineering

Exercise:

Use Claude to accelerate report development.

Assignment:

Create:

```text
10 Claude prompts
+
Prompt execution log
+
AI validation log
+
2 examples of AI-generated mistakes
```

Important:

The application should teach trainees that AI-generated DAX or Power Query must always be validated.

---

### Day 9 — MicroStrategy / Cognos Legacy Migration

Topics:

* Legacy report inventory
* Metric mapping
* Attribute mapping
* Prompt/filter mapping
* DAX recreation
* Reconciliation
* Migration gaps
* Risks

Exercise:

Rebuild a legacy report in Power BI.

Assignment:

Create:

```text
Legacy Report
↓
Metric Mapping
↓
Power BI Model
↓
DAX
↓
Validation
```

---

### Day 10 — Capstone & Certification

Trainees select one capstone:

### Capstone 1 — Healthcare Financial & Claims Dashboard

KPIs:

* Total Revenue
* Total Claims Cost
* Gross Margin
* Member Count
* Claim Count
* Claims PMPM
* Revenue PMPM
* YoY Revenue
* YoY Claims Cost

Pages:

* Executive Overview
* Provider Analysis
* Detail

---

### Capstone 2 — Supply Chain Command Center

KPIs:

* Inventory Value
* Inventory Units
* PO Value
* Supplier Count
* OTD %
* Stock-Out %
* Average Lead Time
* Open PO Value
* Slow Moving Inventory

Pages:

* Supply Chain Executive
* Supplier Analysis
* Inventory Detail

---

### Capstone 3 — Sales & Customer 360

KPIs:

* Revenue
* Target
* Achievement %
* Profit
* Margin %
* Orders
* Customers
* AOV
* New Customers
* Repeat Customers
* YoY Growth

Pages:

* Executive Sales
* Salesperson Performance
* Customer 360

---

# 5. Trainee Dashboard

Create a visually strong trainee dashboard.

Show:

```text
Welcome, <Name>

Course Progress
████████████░░░ 80%

Day
1  2  3  4  5  6  7  8  9  10

Today's Learning
----------------
Study Material     ✓
Exercise           ✓
Quiz               8/10
Assignment         Pending
GitHub Submission  Submitted

Overall Score
82%

Quiz Average
85%

Assignments
6 / 8 completed

Exercises
7 / 8 completed
```

Include:

### Continue Learning

A prominent button:

**Continue Day 5**

The system should determine the next incomplete learning activity.

---

# 6. Daily Learning Page

Create a dedicated page:

```text
Day 5
DAX Essentials

Progress: 65%

[ Study Material ]
[ Exercise ]
[ Quiz ]
[ Assignment ]
```

Each section should have its own completion state.

Example:

```text
✓ Study Material
✓ Exercise
→ Quiz
○ Assignment
```

---

# 7. Study Material

Study material should support:

* Markdown
* Headings
* Images
* Architecture diagrams
* Code snippets
* DAX examples
* SQL examples
* Power Query examples
* Tables
* Callout boxes

Example:

```text
CALCULATE()

CALCULATE modifies the filter context
under which an expression is evaluated.

Example:

Total Sales =
SUM(FactSales[SalesAmount])
```

Provide:

**Mark as Complete**

button.

Completion should be persisted.

---

# 8. Exercise Module

Each exercise should contain:

```text
Exercise Title

Objective

Business Scenario

Dataset

Requirements

Expected Outcome

Hints

Acceptance Criteria
```

Example:

```text
Exercise:
Build Executive Sales Dashboard

Requirements:

1. Revenue KPI
2. Profit KPI
3. Revenue by Region
4. Monthly Revenue Trend
5. Region slicer
6. Product slicer
```

Trainee should be able to:

* Mark exercise as started
* Mark exercise as completed
* Submit GitHub URL
* Add notes

---

# 9. GitHub Submission

Create a GitHub submission component.

Fields:

```text
GitHub Repository URL
Branch
Commit / PR URL
Comments
```

Validate that the URL is a GitHub URL.

Example:

```text
https://github.com/<user>/<repo>
```

Submission status:

```text
Not Submitted
Submitted
Under Review
Passed
Needs Improvement
```

Admin can click the repository link.

Design this so future implementation can integrate with the GitHub API to retrieve:

* Repository metadata
* Latest commit
* Branch
* Pull requests
* Commit history

Do not require GitHub API integration for the initial MVP.

---

# 10. Quiz Module

Each daily topic should contain a quiz.

Initial format:

* Multiple choice
* 5–10 questions
* Four options
* One correct answer
* Immediate feedback
* Score calculation

Example:

```text
Question 1 / 10

Which schema is generally preferred
for analytical Power BI models?

○ Snowflake
● Star
○ OLTP
○ Document

[Previous] [Next]
```

At completion:

```text
Quiz Completed

Score: 8 / 10

80%

Passed ✓
```

Store:

* Attempt
* Answers
* Score
* Start time
* Completion time

Allow configuration for:

```text
Passing Score = 70%
Maximum Attempts = 3
```

Admin should see quiz performance.

---

# 11. Assignment Module

Each day may have an assignment.

Assignment page:

```text
Assignment

Objective

Business Context

Requirements

Expected Deliverables

Submission Instructions

Evaluation Criteria
```

Trainee submission:

```text
Submission Notes

GitHub Repository

Attachment (future)

Submit Assignment
```

After submission:

```text
Status: Under Review

Score: 85 / 100

Trainer Feedback:
...
```

---

# 12. Admin Dashboard

Create a professional enterprise dashboard.

Top-level KPIs:

```text
Total Trainees
Active Trainees
Course Completion
Average Quiz Score
Assignments Pending
Exercises Pending
```

Example:

```text
TRAINING COHORT

Total Trainees       24
Active               22
Completed            4
At Risk              3

Average Progress     72%
Average Quiz Score   81%
```

Charts:

### Cohort Progress

Trainees vs completion %

### Daily Completion

```text
Day 1 ████████████████████ 100%
Day 2 ██████████████████   92%
Day 3 ███████████████      83%
Day 4 █████████████        75%
```

### Quiz Performance

Average score by day.

### Assignment Status

* Submitted
* Pending
* Under Review
* Passed
* Needs Improvement

---

# 13. Trainee Management

Admin page:

```text
Trainees

Name
Email
Role
Progress
Quiz Average
Assignments
Last Active
Status
```

Filters:

```text
Search
Status
Progress
Day
```

Clicking a trainee opens:

## Trainee 360

Show:

```text
Profile

Course Progress

Daily Progress

Quiz Scores

Exercise Completion

GitHub Submissions

Assignments

Trainer Feedback

Activity Timeline
```

---

# 14. At-Risk Trainees

Automatically identify trainees who may need attention.

Example rules:

```text
Progress < 50%
OR

No activity for 2 days
OR

Quiz average < 60%
OR

Multiple overdue assignments
```

Display:

```text
At Risk

John Doe
Progress: 42%
Last Active: 3 days ago
Quiz Average: 58%

[View Trainee]
```

Make these thresholds configurable.

---

# 15. Course Administration

Admin should be able to manage:

```text
Course
 ├── Weeks
 │    ├── Days
 │    │    ├── Study Material
 │    │    ├── Exercises
 │    │    ├── Quiz
 │    │    └── Assignment
```

CRUD operations:

* Create
* Edit
* Delete
* Publish
* Unpublish

Quiz question management:

```text
Question
Options
Correct Answer
Explanation
Difficulty
Topic
```

---

# 16. Suggested Application Architecture

Use:

### Frontend

```text
React
TypeScript
Vite
React Router
```

Use a modern component library such as:

```text
shadcn/ui
```

or an equivalent lightweight component system.

Use:

```text
TanStack Query
```

for server state.

Use:

```text
Zustand
```

for lightweight client state where required.

Use:

```text
React Hook Form
Zod
```

for forms and validation.

---

# 17. Backend Architecture

Design the frontend so it can connect to a REST API.

Suggested backend:

```text
React SPA
      │
      ▼
API Gateway / Backend
      │
      ├── Auth Service
      ├── Course Service
      ├── Quiz Service
      ├── Assignment Service
      ├── Progress Service
      └── Evaluation Service
             │
             ▼
        PostgreSQL
```

For the first prototype, you may implement a mock API layer or local persistence.

However, keep a clean service abstraction:

```text
authService
courseService
progressService
quizService
assignmentService
submissionService
adminService
```

Do not tightly couple UI components to mock data.

---

# 18. Suggested Data Model

Design TypeScript interfaces/models for:

```text
User
Trainee
Course
Week
LearningDay
StudyMaterial
Exercise
Quiz
QuizQuestion
QuizAttempt
Assignment
AssignmentSubmission
GithubSubmission
Evaluation
Progress
Activity
```

Example:

```typescript
interface LearningDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  week: number;
  theoryHours: number;
  labHours: number;
  studyMaterialId: string;
  exerciseId: string;
  quizId: string;
  assignmentId?: string;
}
```

Progress:

```typescript
interface LearningProgress {
  traineeId: string;
  dayId: string;
  studyCompleted: boolean;
  exerciseCompleted: boolean;
  quizCompleted: boolean;
  assignmentSubmitted: boolean;
  quizScore?: number;
  overallStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}
```

---

# 19. UX Requirements

The application should look like a modern corporate learning platform.

Design principles:

* Clean
* Professional
* Minimal
* Responsive
* High information density without clutter
* Excellent typography
* Clear progress indicators
* Strong visual hierarchy
* Consistent navigation

Main navigation for trainee:

```text
Dashboard
Learning Path
Today's Learning
Exercises
Quizzes
Assignments
My Submissions
Profile
```

Admin navigation:

```text
Dashboard
Trainees
Course
Learning Progress
Quiz Analytics
Assignments
GitHub Submissions
Evaluations
Reports
Settings
```

---

# 20. Learning Path UI

Create a timeline:

```text
WEEK 1

✓ Day 1
BI Fundamentals

✓ Day 2
Power Query

→ Day 3
Semantic Modelling

○ Day 4
Visualization

○ Day 5
DAX


WEEK 2

○ Day 6
Customer Prototyping

○ Day 7
Interactive Reports

○ Day 8
Claude-Assisted BI

○ Day 9
Legacy Migration

○ Day 10
Capstone
```

Use visual status indicators.

---

# 21. Notifications

Create an extensible notification system.

Notifications could include:

```text
New quiz available
Assignment due
Assignment evaluated
Trainer feedback available
Exercise submission reviewed
Course milestone completed
```

For MVP, notifications can be in-app.

Design for future email/Teams integration.

---

# 22. Search

Implement global search across:

* Study material
* Exercises
* Assignments
* Quiz topics

Example:

```text
Search "CALCULATE"
```

Results:

```text
Day 5 — DAX Essentials
Day 8 — Claude Assisted BI
```

---

# 23. Reporting

Admin should be able to generate/export:

### Cohort Progress Report

Columns:

```text
Trainee
Day 1
Day 2
Day 3
...
Day 10
Overall %
Quiz Average
Assignments Completed
GitHub Submissions
Final Score
```

Provide CSV export initially.

---

# 24. Future Power BI Integration

Design the application so that training analytics itself could eventually be visualized using Power BI.

Capture useful events:

```text
LOGIN
STUDY_STARTED
STUDY_COMPLETED
EXERCISE_STARTED
EXERCISE_COMPLETED
QUIZ_STARTED
QUIZ_COMPLETED
ASSIGNMENT_SUBMITTED
GITHUB_SUBMITTED
EVALUATION_COMPLETED
COURSE_COMPLETED
```

Store timestamps.

This will allow future analytics such as:

* Learning velocity
* Completion trends
* Quiz performance
* At-risk trainees
* Time spent per module

---

# 25. Seed Data

Create realistic demo data.

Create:

### Admin

```text
admin@ideas2it.com
```

### Trainees

At least 8 demo trainees using:

```text
trainee01@ideas2it.com
trainee02@ideas2it.com
...
trainee08@ideas2it.com
```

Give them different progress levels:

```text
100%
92%
84%
76%
65%
52%
38%
20%
```

This is important because the Admin Dashboard should look realistic during demonstration.

---

# 26. MVP Pages

Implement at minimum:

### Authentication

```text
/login
```

### Trainee

```text
/dashboard
/learning
/learning/day/:dayId
/study/:id
/exercise/:id
/quiz/:id
/assignment/:id
/submissions
/profile
```

### Admin

```text
/admin/dashboard
/admin/trainees
/admin/trainees/:id
/admin/course
/admin/course/day/:id
/admin/quizzes
/admin/assignments
/admin/submissions
/admin/evaluations
/admin/reports
```

---

# 27. Error Handling

Implement:

* Loading states
* Empty states
* Error states
* Form validation
* API error handling
* Unauthorized handling
* Session expiration
* Invalid GitHub URL handling

Do not allow trainees to accidentally lose quiz answers.

---

# 28. Accessibility

Follow reasonable WCAG practices.

Ensure:

* Keyboard navigation
* Accessible labels
* Proper contrast
* Focus states
* Semantic HTML
* Screen-reader-friendly controls

---

# 29. Security

Do not put secrets in the React application.

Never store:

* API keys
* database credentials
* OAuth secrets

in frontend code.

Role checks must eventually be enforced server-side.

Frontend route protection is only a UX layer.

---

# 30. Development Approach

Do NOT generate the entire application blindly in one huge file.

Build incrementally.

### Phase 1

Create:

```text
Project structure
Routing
Theme
Authentication
Layouts
Navigation
Mock data
```

### Phase 2

Build:

```text
Trainee Dashboard
Learning Path
Daily Learning
Study Material
```

### Phase 3

Build:

```text
Exercises
GitHub Submission
Quiz
Assignment
```

### Phase 4

Build:

```text
Admin Dashboard
Trainee Management
Progress Tracking
Evaluation
Analytics
```

### Phase 5

Add:

```text
Validation
Error handling
Responsive design
Accessibility
Testing
```

---

# 31. Important Requirement — Reusable Training Platform

Do NOT hardcode the application architecture specifically around Power BI.

The content should be data-driven.

For example:

```text
Course
   |
   +-- Power BI Developer Accelerator
   |
   +-- Future: React Advanced
   |
   +-- Future: AI Engineering
   |
   +-- Future: Cloud Architecture
```

The platform should support multiple courses in the future.

Therefore:

```text
Course
 → Module/Week
 → Learning Day
 → Study Material
 → Exercise
 → Quiz
 → Assignment
 → Submission
 → Evaluation
```

should be the core abstraction.

---

# 32. Visual Design

Create a professional dashboard inspired by modern SaaS/LMS applications.

Use:

* Cards
* Progress bars
* Timeline
* Tables
* Tabs
* Badges
* Charts
* Status indicators
* Modal dialogs
* Toast notifications

Avoid:

* Excessive gradients
* Excessive animation
* Clutter
* Large decorative elements
* Unnecessary UI complexity

---

# 33. Deliverables

Generate:

1. Complete React SPA
2. TypeScript source
3. Responsive UI
4. Mock authentication
5. Role-based routing
6. Seed course data
7. Seed trainee data
8. Trainee dashboard
9. Admin dashboard
10. Learning path
11. Study material
12. Exercise module
13. Quiz engine
14. Assignment module
15. GitHub submission module
16. Evaluation module
17. Progress tracking
18. Analytics
19. CSV export
20. README
21. Architecture documentation
22. API contract documentation
23. Test cases

---

# 34. Quality Requirements

Before considering the implementation complete:

* Run the application.
* Fix TypeScript errors.
* Fix lint errors.
* Test all routes.
* Test login.
* Test ADMIN vs TRAINEE authorization.
* Test quiz submission.
* Test quiz scoring.
* Test exercise completion.
* Test GitHub URL submission.
* Test assignment submission.
* Test admin evaluation.
* Test progress calculation.
* Test responsive layout.
* Test empty/loading/error states.

Do not simply tell me that the implementation should work.

Actually inspect the implementation and fix issues you encounter.

---

# 35. Claude Development Instructions

Use the following workflow:

### Step 1 — Analyze

First inspect the existing repository.

Identify:

```text
Existing framework
Existing components
Existing routing
Existing state management
Existing styling
Existing API integration
Existing folder structure
```

Do not unnecessarily replace an existing architecture.

### Step 2 — Architecture

Create a concise implementation plan.

### Step 3 — Implement

Implement the application incrementally.

### Step 4 — Validate

Run:

```text
npm install
npm run build
npm run lint
npm test
```

where applicable.

Fix all errors.

### Step 5 — UX Review

Review every major screen as if you were a trainee and as if you were the training manager.

Improve:

* navigation
* readability
* progress visibility
* error handling
* consistency

### Step 6 — Final Documentation

Create:

```text
README.md
docs/architecture.md
docs/data-model.md
docs/api-contract.md
docs/user-guide.md
```

---

# 36. Important Product Principle

The application is not simply a document viewer.

It is a **Learning → Practice → Assessment → Submission → Evaluation → Progress** platform.

The core trainee journey should be:

```text
LEARN
  ↓
PRACTICE
  ↓
TAKE QUIZ
  ↓
BUILD EXERCISE
  ↓
SUBMIT GITHUB
  ↓
SUBMIT ASSIGNMENT
  ↓
TRAINER EVALUATION
  ↓
FEEDBACK
  ↓
NEXT DAY
```

The Admin journey should be:

```text
COHORT
  ↓
TRACK
  ↓
IDENTIFY GAPS
  ↓
REVIEW SUBMISSIONS
  ↓
EVALUATE
  ↓
FEEDBACK
  ↓
MEASURE OUTCOME
```

Build the application around these two journeys.

---

# 37. Final Acceptance Criteria

The MVP is complete only when the following scenario works end-to-end:

### Trainee

```text
Login with Ideas2IT ID
        ↓
Trainee Dashboard
        ↓
Open Day 1
        ↓
Read Study Material
        ↓
Mark Complete
        ↓
Open Exercise
        ↓
Complete Exercise
        ↓
Submit GitHub Repository
        ↓
Take Quiz
        ↓
Receive Score
        ↓
Submit Assignment
        ↓
View Submission Status
        ↓
View Trainer Feedback
        ↓
Progress updates automatically
```

### Admin

```text
Login
   ↓
Admin Dashboard
   ↓
View Cohort Progress
   ↓
Select Trainee
   ↓
View Trainee 360
   ↓
Review GitHub Submission
   ↓
Review Assignment
   ↓
Enter Score + Feedback
   ↓
Mark Passed / Needs Improvement
   ↓
Trainee dashboard updates
```

Implement this complete flow first before adding optional enhancements.

Start by inspecting the repository and then propose the implementation plan and folder structure before making major changes.
