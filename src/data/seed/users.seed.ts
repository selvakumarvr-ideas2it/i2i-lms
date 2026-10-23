import type { Admin, Trainee } from '@/domain/user'

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

export const ADMIN_USER: Admin = {
  id: 'user-admin-1',
  name: 'Priya Admin',
  email: 'powerbi.admin@ideas2it.com',
  role: 'ADMIN',
  avatarInitials: initialsOf('Priya Admin'),
  joinedAt: '2026-01-05T09:00:00.000Z',
  title: 'Program Director',
}

const COHORT = 'PBI-Accelerator-2026-Q1'

interface TraineeSeed {
  id: string
  name: string
  email: string
  joinedAt: string
}

const TRAINEE_SEEDS: TraineeSeed[] = [
  { id: 'user-trainee-01', name: 'Ananya Sharma', email: 'trainee01@ideas2it.com', joinedAt: '2026-08-18T09:00:00.000Z' },
  { id: 'user-trainee-02', name: 'Rahul Verma', email: 'trainee02@ideas2it.com', joinedAt: '2026-08-19T09:00:00.000Z' },
  { id: 'user-trainee-03', name: 'Priya Nair', email: 'trainee03@ideas2it.com', joinedAt: '2026-08-20T09:00:00.000Z' },
  { id: 'user-trainee-04', name: 'Karthik Subramanian', email: 'trainee04@ideas2it.com', joinedAt: '2026-08-21T09:00:00.000Z' },
  { id: 'user-trainee-05', name: 'Meera Iyer', email: 'trainee05@ideas2it.com', joinedAt: '2026-08-22T09:00:00.000Z' },
  { id: 'user-trainee-06', name: 'Arjun Menon', email: 'trainee06@ideas2it.com', joinedAt: '2026-08-23T09:00:00.000Z' },
  { id: 'user-trainee-07', name: 'Sneha Reddy', email: 'trainee07@ideas2it.com', joinedAt: '2026-08-24T09:00:00.000Z' },
  { id: 'user-trainee-08', name: 'Vikram Rao', email: 'trainee08@ideas2it.com', joinedAt: '2026-08-25T09:00:00.000Z' },
]

export const TRAINEES: Trainee[] = TRAINEE_SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  email: seed.email,
  role: 'TRAINEE',
  avatarInitials: initialsOf(seed.name),
  joinedAt: seed.joinedAt,
  cohort: COHORT,
}))
