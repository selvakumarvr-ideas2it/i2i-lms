import { getTableClient, TABLE_NAMES } from '../tableClientFactory'
import type { NotificationRepository } from '../interfaces'
import type { Notification, NotificationType } from '../../../../src/domain/notification'

interface NotificationEntity {
  partitionKey: string
  rowKey: string
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

function toEntity(notification: Notification): NotificationEntity {
  const entity: NotificationEntity = {
    partitionKey: notification.userId,
    rowKey: notification.id,
    id: notification.id,
    userId: notification.userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  }
  if (notification.link != null) entity.link = notification.link
  return entity
}

function fromEntity(entity: NotificationEntity): Notification {
  return {
    id: entity.id,
    userId: entity.userId,
    type: entity.type,
    title: entity.title,
    message: entity.message,
    link: entity.link ?? null,
    isRead: entity.isRead,
    createdAt: entity.createdAt,
  }
}

export function createTableNotificationRepository(): NotificationRepository {
  return {
    async listForUser(userId) {
      const client = await getTableClient(TABLE_NAMES.notifications)
      const results: Notification[] = []
      for await (const entity of client.listEntities<NotificationEntity>({ queryOptions: { filter: `PartitionKey eq '${userId}'` } })) {
        results.push(fromEntity(entity))
      }
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },

    async create(notification) {
      const client = await getTableClient(TABLE_NAMES.notifications)
      await client.upsertEntity(toEntity(notification), 'Replace')
      return notification
    },

    async markRead(id, userId) {
      const client = await getTableClient(TABLE_NAMES.notifications)
      await client.updateEntity({ partitionKey: userId, rowKey: id, isRead: true }, 'Merge')
    },

    async markAllRead(userId) {
      const client = await getTableClient(TABLE_NAMES.notifications)
      for await (const entity of client.listEntities<NotificationEntity>({ queryOptions: { filter: `PartitionKey eq '${userId}' and isRead eq false` } })) {
        await client.updateEntity({ partitionKey: entity.partitionKey, rowKey: entity.rowKey, isRead: true }, 'Merge')
      }
    },
  }
}
