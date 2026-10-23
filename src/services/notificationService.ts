import { apiFetch } from '@/services/http'
import type { Notification, NotificationType } from '@/domain/notification'

/** Scoped entirely to the authenticated caller on the backend — `userId` is accepted
 *  here only to keep the call sites (which always pass the current user's own id)
 *  unchanged; the server ignores any notion of "someone else's" notifications. */
export async function getNotificationsForUser(_userId: string): Promise<Notification[]> {
  return apiFetch('/api/notifications')
}

export async function getUnreadCount(userId: string): Promise<number> {
  const notifications = await getNotificationsForUser(userId)
  return notifications.filter((n) => !n.isRead).length
}

/**
 * Not called from the UI anymore — evaluation flows create their notification as a
 * server-side side effect of the evaluate endpoint (see adminService), so there's no
 * dedicated "create notification" route for the frontend to call directly.
 */
export async function createNotification(
  _userId: string,
  _type: NotificationType,
  _title: string,
  _message: string,
  _link: string | null = null,
): Promise<Notification> {
  throw new Error('createNotification is not implemented — notifications are created server-side.')
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
}

export async function markAllNotificationsRead(_userId: string): Promise<void> {
  await apiFetch('/api/notifications/read-all', { method: 'PATCH' })
}
