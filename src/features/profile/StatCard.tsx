export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface p-4">
      <b className="block text-2xl font-bold text-ink">{value}</b>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}
