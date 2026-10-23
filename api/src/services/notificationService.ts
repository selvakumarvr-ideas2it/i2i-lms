import { randomUUID } from 'node:crypto'
import type { Repositories } from '../repositories/interfaces'
import type { NotificationType } from '../../../src/domain/notification'

export function createNotificationService(repos: Repositories) {
  return {
    getNotificationsForUser(userId: string) {
      return repos.notifications.listForUser(userId)
    },

    async getUnreadCount(userId: string) {
      const notifications = await repos.notifications.listForUser(userId)
      return notifications.filter((n) => !n.isRead).length
    },

    createNotification(userId: string, type: NotificationType, title: string, message: string, link: string | null = null) {
      return repos.notifications.create({
        id: randomUUID(),
        userId,
        type,
        title,
        message,
        link,
        isRead: false,
        createdAt: new Date().toISOString(),
      })
    },

    markNotificationRead(id: string, userId: string) {
      return repos.notifications.markRead(id, userId)
    },

    markAllNotificationsRead(userId: string) {
      return repos.notifications.markAllRead(userId)
    },
  }
}

export type NotificationService = ReturnType<typeof createNotificationService>
