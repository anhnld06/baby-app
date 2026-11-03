/** Calendar-date estimate using the conventional 40-week (280-day) baseline.
 * This does not revise an established obstetric due date.
 */
export function dueDateFromGestationalAge(
  examinedOn: string,
  weeks: number | null | undefined,
  days: number | null | undefined,
): string | undefined {
  if (weeks == null || days == null || !Number.isInteger(weeks) || !Number.isInteger(days)
    || weeks < 0 || weeks > 45 || days < 0 || days > 6 || weeks * 7 + days === 0) return undefined;
  const dateKey = examinedOn.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return undefined;
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== dateKey) return undefined;
  date.setUTCDate(date.getUTCDate() + 280 - weeks * 7 - days);
  return date.toISOString().slice(0, 10);
}
