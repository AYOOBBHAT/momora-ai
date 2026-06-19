/** Visual activity level from recency — not page progress (no API field for that yet). */
export function getContinueActivityProgress(isoDate: string): number {
  const hours = (Date.now() - new Date(isoDate).getTime()) / 3_600_000;

  if (hours < 1) {
    return 0.82;
  }
  if (hours < 24) {
    return 0.62;
  }
  if (hours < 72) {
    return 0.42;
  }

  return 0.28;
}
