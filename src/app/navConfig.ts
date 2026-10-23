import {
  BarChart3,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  GitPullRequest,
  LayoutDashboard,
  ListChecks,
  Map,
  Settings,
  UploadCloud,
  UserCircle,
  Users,
} from 'lucide-react'
import { ROUTES } from '@/routes'

export interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
}

export const TRAINEE_NAV: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Learning Path', to: ROUTES.learningPath, icon: Map },
  { label: 'My Submissions', to: ROUTES.submissions, icon: UploadCloud },
  { label: 'Profile', to: ROUTES.profile, icon: UserCircle },
]

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.adminDashboard, icon: Gauge },
  { label: 'Trainees', to: ROUTES.adminTrainees, icon: Users },
  { label: 'Course', to: ROUTES.adminCourse, icon: BarChart3 },
  { label: 'Quizzes', to: ROUTES.adminQuizzes, icon: ListChecks },
  { label: 'Assignments', to: ROUTES.adminAssignments, icon: ClipboardCheck },
  { label: 'GitHub Submissions', to: ROUTES.adminSubmissions, icon: GitPullRequest },
  { label: 'Evaluations', to: ROUTES.adminEvaluations, icon: FileCheck2 },
  { label: 'Reports', to: ROUTES.adminReports, icon: BarChart3 },
  { label: 'Settings', to: ROUTES.adminSettings, icon: Settings },
]
