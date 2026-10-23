import { ADMIN_NAV } from '@/app/navConfig'
import { AppShell } from '@/app/layouts/AppShell'

export function AdminLayout() {
  return <AppShell navItems={ADMIN_NAV} modeLabel="Admin Console" />
}
