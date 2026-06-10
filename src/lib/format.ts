const ET = "America/New_York";

export function formatKickoff(iso: string) {
  const d = new Date(iso);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    weekday: "long",
  }).format(d);
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    month: "short",
    day: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
  return { weekday, date, time: `${time} ET` };
}

export function formatArticleDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00-04:00`));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}
