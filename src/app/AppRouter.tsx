import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { RoleBasedRoute } from '@/auth/RoleBasedRoute'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { TraineeLayout } from '@/app/layouts/TraineeLayout'
import { RootRedirect } from '@/app/RootRedirect'
import { LoadingState } from '@/components/shared/States'
import { LoginPage } from '@/features/auth/LoginPage'
import { ROUTES } from '@/routes'

const SearchPage = lazy(() => import('@/features/search/SearchPage').then((m) => ({ default: m.SearchPage })))

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const LearningPathPage = lazy(() => import('@/features/learning-path/LearningPathPage').then((m) => ({ default: m.LearningPathPage })))
const DailyLearningPage = lazy(() => import('@/features/daily-learning/DailyLearningPage').then((m) => ({ default: m.DailyLearningPage })))
const StudyMaterialPage = lazy(() => import('@/features/study-material/StudyMaterialPage').then((m) => ({ default: m.StudyMaterialPage })))
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const ExercisePage = lazy(() => import('@/features/exercise/ExercisePage').then((m) => ({ default: m.ExercisePage })))
const QuizPage = lazy(() => import('@/features/quiz/QuizPage').then((m) => ({ default: m.QuizPage })))
const AssignmentPage = lazy(() => import('@/features/assignment/AssignmentPage').then((m) => ({ default: m.AssignmentPage })))
const MySubmissionsPage = lazy(() => import('@/features/submissions/MySubmissionsPage').then((m) => ({ default: m.MySubmissionsPage })))

const AdminDashboardPage = lazy(() => import('@/features/admin/dashboard/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })))
const TraineesListPage = lazy(() => import('@/features/admin/trainees/TraineesListPage').then((m) => ({ default: m.TraineesListPage })))
const TraineeDetailPage = lazy(() => import('@/features/admin/trainees/TraineeDetailPage').then((m) => ({ default: m.TraineeDetailPage })))
const CourseAdminPage = lazy(() => import('@/features/admin/course/CourseAdminPage').then((m) => ({ default: m.CourseAdminPage })))
const CourseDayAdminPage = lazy(() => import('@/features/admin/course/CourseDayAdminPage').then((m) => ({ default: m.CourseDayAdminPage })))
const QuizManagementPage = lazy(() => import('@/features/admin/quizzes/QuizManagementPage').then((m) => ({ default: m.QuizManagementPage })))
const AssignmentManagementPage = lazy(() =>
  import('@/features/admin/assignments/AssignmentManagementPage').then((m) => ({ default: m.AssignmentManagementPage })),
)
const GithubSubmissionsAdminPage = lazy(() =>
  import('@/features/admin/submissions/GithubSubmissionsAdminPage').then((m) => ({ default: m.GithubSubmissionsAdminPage })),
)
const EvaluationsPage = lazy(() => import('@/features/admin/evaluations/EvaluationsPage').then((m) => ({ default: m.EvaluationsPage })))
const ReportsPage = lazy(() => import('@/features/admin/reports/ReportsPage').then((m) => ({ default: m.ReportsPage })))
const AtRiskSettingsPage = lazy(() => import('@/features/admin/settings/AtRiskSettingsPage').then((m) => ({ default: m.AtRiskSettingsPage })))

function PageFallback() {
  return <LoadingState label="Loading…" />
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allow={['TRAINEE']} />}>
            <Route element={<TraineeLayout />}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.learningPath} element={<LearningPathPage />} />
              <Route path={ROUTES.learningDay()} element={<DailyLearningPage />} />
              <Route path={ROUTES.study()} element={<StudyMaterialPage />} />
              <Route path={ROUTES.exercise()} element={<ExercisePage />} />
              <Route path={ROUTES.quiz()} element={<QuizPage />} />
              <Route path={ROUTES.assignment()} element={<AssignmentPage />} />
              <Route path={ROUTES.submissions} element={<MySubmissionsPage />} />
              <Route path={ROUTES.profile} element={<ProfilePage />} />
              <Route path={ROUTES.search} element={<SearchPage />} />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allow={['ADMIN', 'MANAGER']} />}>
            <Route element={<AdminLayout />}>
              <Route path={ROUTES.adminDashboard} element={<AdminDashboardPage />} />
              <Route path={ROUTES.adminTrainees} element={<TraineesListPage />} />
              <Route path={ROUTES.adminTrainee()} element={<TraineeDetailPage />} />
              <Route path={ROUTES.adminCourse} element={<CourseAdminPage />} />
              <Route path={ROUTES.adminCourseDay()} element={<CourseDayAdminPage />} />
              <Route path={ROUTES.adminQuizzes} element={<QuizManagementPage />} />
              <Route path={ROUTES.adminAssignments} element={<AssignmentManagementPage />} />
              <Route path={ROUTES.adminSubmissions} element={<GithubSubmissionsAdminPage />} />
              <Route path={ROUTES.adminEvaluations} element={<EvaluationsPage />} />
              <Route path={ROUTES.adminReports} element={<ReportsPage />} />
              <Route path={ROUTES.adminSettings} element={<AtRiskSettingsPage />} />
            </Route>
          </Route>

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
