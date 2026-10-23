# User Guide

## Signing in

Go to `/login` and enter your Ideas2IT email address (`firstname.lastname@ideas2it.com`)
and the shared default password `biviz2026@i2i` — access is restricted to accounts your
program administrator has added to the platform. If your email or password isn't
recognized, you'll see an error asking you to contact your program administrator.

After your first sign-in, use **Change Password** from the account menu (top-right
avatar) to set your own password.

## For Trainees

### Dashboard (`/dashboard`)
Your home page: overall course progress, a **Continue Day N** button that always points
to your next incomplete activity, today's four learning steps (Study Material, Exercise,
Quiz, Assignment) with their status, your quiz average / assignment / exercise counts,
and a feed of your recent activity.

### Learning Path (`/learning`)
The full 10-day roadmap, grouped by week, with a status marker per day (done / in
progress / not started). Click any day to open it — you're never blocked from looking
ahead.

### A day's page (`/learning/day/:id`)
Shows the day's learning objectives and four steps in order:

1. **Study Material** — read it, then click **Mark as Complete**.
2. **Exercise** — a business scenario with requirements and acceptance criteria. Click
   **Start Exercise**, do the work in Power BI Desktop against the referenced dataset,
   then **Mark Exercise Completed** and submit your GitHub repository URL (with
   optional branch/commit/PR link and notes) from the same page.
3. **Quiz** — one multiple-choice question at a time. Your answers autosave as you go,
   so refreshing the page never loses your progress. You have a limited number of
   attempts (shown on the page) and need the listed passing score to pass; you'll see
   your score and a full answer review immediately after submitting.
4. **Assignment** — (every day except Day 10) a business deliverable. Submit your notes
   and GitHub repository; once a trainer reviews it you'll see your score and their
   feedback here, and can revise and resubmit if marked **Needs Improvement**.

### My Submissions (`/submissions`)
Every GitHub and assignment submission you've made, with its current status
(Submitted / Under Review / Passed / Needs Improvement).

### Search (`/search`)
Search study material, exercises, assignments and quiz topics by keyword (e.g.
"CALCULATE" or "star schema") — results are grouped by day.

### Profile (`/profile`)
Your account details and a read-only summary of your progress.

## For Admins

### Dashboard (`/admin/dashboard`)
Cohort-wide KPIs (total/active/completed/at-risk trainees, average progress, average
quiz score), a daily completion chart, quiz performance by day, an assignment status
breakdown, and a list of trainees currently flagged **At Risk**.

### Trainees (`/admin/trainees`)
Search and filter the full cohort (All / At Risk / Completed / Active). Click a trainee
to open their **Trainee 360** view (`/admin/trainees/:id`): profile, progress by day,
quiz scores, GitHub submissions (with clickable repo links), assignment submissions,
trainer feedback history and a full activity timeline.

### GitHub Submissions (`/admin/submissions`)
Every trainee's GitHub submissions in one place — open a repo link, then **Review** to
set its status and leave a comment.

### Evaluations (`/admin/evaluations`)
The assignment review queue (Pending / Evaluated / All). **Evaluate** a submission to
set a score, status (Under Review / Passed / Needs Improvement) and written feedback —
the trainee sees this immediately on their Assignment page and gets a notification.

### Course (`/admin/course`)
Edit each day's study material, exercise and assignment content, and publish/unpublish
a day. Quiz content has its own page:

### Quizzes (`/admin/quizzes`) and Assignments (`/admin/assignments`)
Edit quiz questions/options/correct answers/passing score/attempts, and assignment
requirements/deliverables/evaluation criteria, independent of the general course editor.

### Reports (`/admin/reports`)
Export the full cohort progress report (per-trainee, per-day completion, quiz average,
assignments completed, GitHub submission count) as a CSV.

### Settings (`/admin/settings`)
Tune the at-risk thresholds (minimum progress %, inactivity days, minimum quiz average,
max overdue assignments) that drive the At Risk list on the dashboard and trainee list.
