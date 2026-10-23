import { getTableClient, TABLE_NAMES } from '../tableClientFactory'
import { invertedTicksRowKey } from '../tableKeys'
import type { ActivityRepository } from '../interfaces'
import type { ActivityEvent, ActivityEventType } from '../../../../src/domain/activity'

interface ActivityEntity {
  partitionKey: string
  rowKey: string
  id: string
  traineeId: string
  type: ActivityEventType
  dayId?: string
  metadataJson?: string
  timestamp: string
}

function toEntity(event: ActivityEvent): ActivityEntity {
  const entity: ActivityEntity = {
    partitionKey: event.traineeId,
    rowKey: invertedTicksRowKey(event.timestamp, event.id),
    id: event.id,
    traineeId: event.traineeId,
    type: event.type,
    timestamp: event.timestamp,
  }
  if (event.dayId != null) entity.dayId = event.dayId
  if (event.metadata != null) entity.metadataJson = JSON.stringify(event.metadata)
  return entity
}

function fromEntity(entity: ActivityEntity): ActivityEvent {
  return {
    id: entity.id,
    traineeId: entity.traineeId,
    type: entity.type,
    dayId: entity.dayId ?? null,
    metadata: entity.metadataJson ? JSON.parse(entity.metadataJson) : null,
    timestamp: entity.timestamp,
  }
}

export function createTableActivityRepository(): ActivityRepository {
  return {
    async append(event) {
      const client = await getTableClient(TABLE_NAMES.activity)
      await client.upsertEntity(toEntity(event), 'Replace')
      return event
    },

    async listForTrainee(traineeId, limit) {
      const client = await getTableClient(TABLE_NAMES.activity)
      const results: ActivityEvent[] = []
      // RowKey is an inverted timestamp, so partition order is already newest-first —
      // we can stop reading as soon as we hit `limit`, no in-memory sort needed.
      for await (const entity of client.listEntities<ActivityEntity>({ queryOptions: { filter: `PartitionKey eq '${traineeId}'` } })) {
        results.push(fromEntity(entity))
        if (limit && results.length >= limit) break
      }
      return results
    },
  }
}
