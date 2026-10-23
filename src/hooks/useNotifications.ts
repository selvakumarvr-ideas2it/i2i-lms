import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as notificationService from '@/services/notificationService'

const notificationKeys = {
  list: (userId: string) => ['notifications', userId] as const,
}

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.list(userId ?? ''),
    queryFn: () => notificationService.getNotificationsForUser(userId as string),
    enabled: Boolean(userId),
    refetchInterval: 60_000,
  })
}

export function useMarkAllNotificationsRead(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationService.markAllNotificationsRead(userId as string),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId ?? '') }),
  })
}

export function useMarkNotificationRead(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationService.markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId ?? '') }),
  })
}
