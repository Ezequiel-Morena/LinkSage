// src/utils/formatTime.ts
interface FormattedTime {
  days?: string;
  hours?: string;
  minutes?: string;
  seconds?: string;
}

const padTime = (n: number): string => n.toString().padStart(2, '0');

export const formatTime = (totalSeconds: number): FormattedTime | null => {
  if (totalSeconds <= 0) return null;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const result: FormattedTime = {};

  if (days > 0) result.days = padTime(days);
  if (hours > 0 || days > 0) result.hours = padTime(hours);
  if (minutes > 0 || hours > 0 || days > 0) result.minutes = padTime(minutes);
  result.seconds = padTime(seconds);

  return result;
};