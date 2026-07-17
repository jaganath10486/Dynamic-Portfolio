const NSE_OPEN_HOUR = 9;
const NSE_OPEN_MINUTE = 15;
const NSE_CLOSE_HOUR = 15;
const NSE_CLOSE_MINUTE = 30;
const IST_OFFSET_MINUTES = 330;

const toISTDate = (): Date => {
  const utcNow = new Date();
  const istOffsetMs = IST_OFFSET_MINUTES * 60 * 1000;
  return new Date(utcNow.getTime() + istOffsetMs);
};

const toMinutesSinceMidnight = (date: Date): number => {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
};

export const isNseOpen = (): boolean => {
  const ist = toISTDate();
  const dayOfWeek = ist.getUTCDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) return false;

  const currentMinutes = toMinutesSinceMidnight(ist);
  const openMinutes = NSE_OPEN_HOUR * 60 + NSE_OPEN_MINUTE;
  const closeMinutes = NSE_CLOSE_HOUR * 60 + NSE_CLOSE_MINUTE;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

