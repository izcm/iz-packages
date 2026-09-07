export type DateLike = number | Date | string;

const toDate = (date: DateLike): Date =>
  date instanceof Date ? date : new Date(date);

export const timeAgo = (date: DateLike, locale: string = "en"): string => {
  const secs = Math.floor((Date.now() - toDate(date).getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });

  if (secs < 60) return rtf.format(0, "second");

  const mins = Math.floor(secs / 60);
  if (mins < 60) return rtf.format(-mins, "minute");

  const hours = Math.floor(mins / 60);
  if (hours < 24) return rtf.format(-hours, "hour");

  const days = Math.floor(hours / 24);
  return rtf.format(-days, "day");
};

export function getDaysUntil(date: DateLike): number {
  const ms = toDate(date).getTime() - Date.now();

  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatDaysUntil(date: DateLike, locale: string = "en"): string {
  const days = getDaysUntil(date);

  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(days, "day");
}
