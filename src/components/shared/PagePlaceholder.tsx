import { Card, CardContent } from '@/components/ui/Card'

export function PagePlaceholder({ title, description }: { title: string; description?: string }) {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Coming soon</p>
        <h1 className="mt-2 text-xl font-semibold text-ink">{title}</h1>
        {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>}
      </CardContent>
    </Card>
  )
}
