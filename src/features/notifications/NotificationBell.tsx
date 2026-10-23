import { Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Badge } from '@/components/ui/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { EmptyState } from '@/components/shared/States'
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/hooks/useNotifications'

export function NotificationBell() {
  const { user } = useAuth()
  const { data: notifications = [] } = useNotifications(user?.id)
  const markAllRead = useMarkAllNotificationsRead(user?.id)
  const markRead = useMarkNotificationRead(user?.id)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-slate-100">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="flex items-center justify-between px-2.5 py-1.5">
          <DropdownMenuLabel className="p-0 text-xs">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              className="focus-ring rounded text-xs font-medium text-brand-600 hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-3">
            <EmptyState title="No notifications yet" description="You'll see quiz, assignment and feedback updates here." />
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.slice(0, 8).map((n) => (
              <DropdownMenuItem
                key={n.id}
                asChild
                onSelect={() => !n.isRead && markRead.mutate(n.id)}
                className="flex-col items-start gap-0.5"
              >
                <Link to={n.link ?? '#'}>
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-medium text-ink">{n.title}</span>
                    {!n.isRead && <Badge tone="brand">New</Badge>}
                  </div>
                  <span className="line-clamp-2 text-xs text-muted">{n.message}</span>
                  <span className="mt-0.5 text-[11px] text-slate-400">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
