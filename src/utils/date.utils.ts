export const getFutureTimeBySeconds = (seconds: number) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + seconds);
  return time;
};

export const getFormattedDate = (
  isoDate: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
) => {
  const date = new Date(isoDate);
  const userLocale =
    locale || navigator.language || (navigator as any).userLanguage;

  return new Intl.DateTimeFormat(userLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    ...(options || {}),
  }).format(date);
};

export const getPayloadDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
