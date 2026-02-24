export function calculateEarned(
  amount: number,
  now: Date,
  periodStart: Date,
  periodEnd: Date,
): number {
  const periodMs = periodEnd.getTime() - periodStart.getTime();
  if (periodMs <= 0) return 0;
  const elapsedMs = now.getTime() - periodStart.getTime();
  const ratio = Math.max(0, Math.min(1, elapsedMs / periodMs));
  return amount * ratio;
}
