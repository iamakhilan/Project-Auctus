export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTimezoneOffsetString = (date: Date = new Date()): string => {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
  const minutes = String(absMinutes % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

export const getLocalISOStringWithOffset = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const offset = getTimezoneOffsetString(date);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offset}`;
};

export const parseLocalDateParts = (dateStr: string): { year: number; month: number; day: number } => {
  const [year, month, day] = dateStr.slice(0, 10).split('-').map(Number);
  return { year, month, day };
};

export const getPreviousLocalDateString = (dateStr: string): string => {
  const { year, month, day } = parseLocalDateParts(dateStr);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
};

export const getCalendarDayDifference = (earlierDateStr: string, laterDateStr: string): number => {
  const { year: y1, month: m1, day: d1 } = parseLocalDateParts(earlierDateStr);
  const { year: y2, month: m2, day: d2 } = parseLocalDateParts(laterDateStr);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / msPerDay);
};
