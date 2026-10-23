import { TRAINEE_NAV } from '@/app/navConfig'
import { AppShell } from '@/app/layouts/AppShell'

export function TraineeLayout() {
  return <AppShell navItems={TRAINEE_NAV} modeLabel="BI Visualization Accelerator" />
}
