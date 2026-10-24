const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LONG_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (n: number) => String(n).padStart(2, '0');

export const time = (iso: string | Date) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const endTime = (iso: string, minutes: number) => time(new Date(new Date(iso).getTime() + minutes * 60000));

export const shortDay = (d: Date) => DAYS[d.getDay()];

export const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export function dayLabel(iso: string | Date, now = new Date()) {
  const d = new Date(iso);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (sameDay(d, now)) return 'Today';
  if (sameDay(d, tomorrow)) return 'Tomorrow';
  return `${LONG_DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// Today, Tomorrow, or "Tue 27 Oct".
export function dayShort(iso: string | Date, now = new Date()) {
  const label = dayLabel(iso, now);
  if (label === 'Today' || label === 'Tomorrow') return label;
  const d = new Date(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export const dateLong = (iso: string | Date) => {
  const d = new Date(iso);
  return `${LONG_DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

export const money = (n: number) => (n === 0 ? 'Free' : `£${n % 1 === 0 ? n : n.toFixed(2)}`);

export function relative(iso: string, now = new Date()) {
  const mins = Math.round((new Date(iso).getTime() - now.getTime()) / 60000);
  if (mins < 0) return 'Happening now';
  if (mins < 60) return `Starts in ${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `In ${hrs} hr${hrs === 1 ? '' : 's'}`;
  return dayLabel(iso, now);
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
