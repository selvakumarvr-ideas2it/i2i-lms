export type Role = 'ADMIN' | 'TRAINEE' | 'MANAGER'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarInitials: string
  joinedAt: string
}

export interface Trainee extends User {
  role: 'TRAINEE'
  cohort: string
}

export interface Admin extends User {
  role: 'ADMIN'
  title: string
}

/** Read-only visibility into the admin console (cohort stats, trainees, reports) — no create/update/delete access anywhere. */
export interface Manager extends User {
  role: 'MANAGER'
  title: string
}
