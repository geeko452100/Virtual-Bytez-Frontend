import { cn } from '../../lib/cn'

export default function ConditionBadge({ grade, condition }) {
  if (!grade && !condition) return null

  const label = grade ? `${condition} · ${grade}/10` : condition

  let tier = 'mid'
  if (grade >= 9) tier = 'high'
  else if (grade <= 6) tier = 'low'

  return (
    <span
      className={cn(
        'mb-1 inline-block rounded px-2 py-0.5 font-mono text-xs',
        tier === 'high' && 'bg-phosphor/15 text-phosphor',
        tier === 'mid' && 'bg-accent-bg text-accent',
        tier === 'low' && 'bg-danger/12 text-danger',
      )}
      title="Condition grade"
    >
      {label}
    </span>
  )
}
