import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

export const RadioGroup = RadioGroupPrimitive.Root

export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'focus-ring flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 data-[state=checked]:border-brand-600',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="h-2.5 w-2.5 rounded-full bg-brand-600" />
    </RadioGroupPrimitive.Item>
  )
}
