import * as ToastPrimitive from '@radix-ui/react-toast'
import { useToastStore } from '@/stores/toastStore'
import { cn } from '@/lib/utils'

const VARIANT_STYLES: Record<string, string> = {
  default: 'border-line bg-white text-ink',
  success: 'border-success-500/30 bg-success-50 text-success-700',
  danger: 'border-danger-500/30 bg-danger-50 text-danger-600',
}

export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          duration={5000}
          onOpenChange={(open) => !open && dismiss(t.id)}
          className={cn('rounded-card border p-4 shadow-lg transition-all', VARIANT_STYLES[t.variant])}
        >
          <ToastPrimitive.Title className="text-sm font-semibold">{t.title}</ToastPrimitive.Title>
          {t.description && <ToastPrimitive.Description className="mt-1 text-xs">{t.description}</ToastPrimitive.Description>}
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] m-0 flex w-96 max-w-[100vw] list-none flex-col gap-2 p-6 outline-none" />
    </ToastPrimitive.Provider>
  )
}
