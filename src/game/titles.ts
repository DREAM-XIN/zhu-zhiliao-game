export function titleForScore(score: number): string {
  const safeScore = Math.max(0, score)
  if (safeScore >= 1200) return '竹海鸣王'
  if (safeScore >= 700) return '连鸣高手'
  if (safeScore >= 300) return '竹林小将'
  return '初醒竹鸣'
}
