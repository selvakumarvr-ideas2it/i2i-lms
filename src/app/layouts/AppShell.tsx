import { Search } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Badge } from '@/components/ui/Badge'
import { NotificationBell } from '@/features/notifications/NotificationBell'
import { UserMenu } from '@/components/shared/UserMenu'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes'
import type { NavItem } from '@/app/navConfig'

interface AppShellProps {
  navItems: NavItem[]
  modeLabel: string
}

export function AppShell({ navItems, modeLabel }: AppShellProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-navy px-4 py-1.5 text-center text-[11px] font-medium tracking-wide text-slate-300 sm:px-[5%] sm:text-right">
        Ideas2IT Internal Learning Platform
      </div>

      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-line bg-white px-4 sm:px-[5%]">
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold text-ink">
            Ideas<span className="text-brand-500">2</span>IT
          </span>
          <Badge tone="neutral" className="hidden sm:inline-flex">
            {modeLabel}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'TRAINEE' && (
            <NavLink
              to={ROUTES.search}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-slate-100"
              aria-label="Search the course"
            >
              <Search className="h-5 w-5" />
            </NavLink>
          )}
          <NotificationBell />
          <UserMenu />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <nav
          aria-label="Primary"
          className="scrollbar-none flex shrink-0 gap-1 overflow-x-auto border-b border-line bg-white p-2 md:w-60 md:flex-col md:border-b-0 md:border-r md:p-4"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'focus-ring flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-ink',
                  isActive && 'bg-brand-50 text-brand-700 hover:bg-brand-50 hover:text-brand-700',
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
