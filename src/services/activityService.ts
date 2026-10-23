import { apiFetch } from '@/services/http'
import type { ActivityEvent, ActivityEventType } from '@/domain/activity'

export async function logActivity(
  traineeId: string,
  type: ActivityEventType,
  dayId: string | null = null,
  metadata: Record<string, string | number | boolean> | null = null,
): Promise<ActivityEvent> {
  return apiFetch(`/api/trainees/${traineeId}/activity`, {
    method: 'POST',
    body: JSON.stringify({ type, dayId, metadata }),
  })
}

export async function getActivityForTrainee(traineeId: string, limit?: number): Promise<ActivityEvent[]> {
  const query = limit ? `?limit=${limit}` : ''
  return apiFetch(`/api/trainees/${traineeId}/activity${query}`)
}
