/**
 * Front-facing content shows the last two months. Anything older lives in the
 * Hemeroteca (the archive) so the feeds stay current and the library still
 * builds up. One knob, used by the section strips, /noticias, and the archive.
 */
export const RECENT_DAYS = 60;

/** True when a date (ISO string or Date) falls within the last `days` days. */
export function isWithinDays(value: string | number | Date, days = RECENT_DAYS): boolean {
  const d = new Date(value);
  if (isNaN(d.getTime())) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return d.getTime() >= cutoff;
}
