/** "Jul 2026" + "Present" → "Jul 2026 — Present"; no start → "Present". */
export function formatRange(start: string | undefined, end: string): string {
  return start ? `${start} — ${end}` : end;
}
