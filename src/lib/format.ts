export function byDateDesc<T extends { data: { date: Date } }>(
  a: T,
  b: T,
): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function byStartDesc<T extends { data: { start: Date } }>(
  a: T,
  b: T,
): number {
  return b.data.start.getTime() - a.data.start.getTime();
}

/** Adds a closing period unless the text already ends in punctuation. */
export function withPeriod(text: string): string {
  return /[.?!]$/.test(text) ? text : `${text}.`;
}
