/**
 * Encodes a timestamp so that ascending RowKey order == newest-first. Table Storage
 * only sorts lexically within a partition, so `listEntities` naturally returns the
 * newest N rows first with no in-memory sort and no full-partition read when you only
 * need the first page — the standard "reverse chronological" Table Storage pattern.
 * Valid for dates well before year 2286 (13-digit epoch ms ceiling below).
 */
export function invertedTicksRowKey(isoTimestamp: string, uniqueSuffix: string): string {
  const ms = new Date(isoTimestamp).getTime()
  const inverted = (9999999999999 - ms).toString().padStart(13, '0')
  return `${inverted}_${uniqueSuffix}`
}
