import { schedule } from '../data/brand.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Current day and minutes in Lahore, whatever the visitor's own zone.
export function lahoreNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: schedule.timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = DAY_NAMES.indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function kitchenStatus(date = new Date()) {
  const { day, minutes } = lahoreNow(date);
  const openToday = !schedule.closedDays.includes(day);
  if (openToday && minutes >= schedule.open && minutes < schedule.lastOrders) {
    return { open: true, label: 'Kitchen open · last orders 11:30pm' };
  }
  if (openToday && minutes >= schedule.lastOrders && minutes < schedule.close) {
    return { open: true, label: 'Last orders called · bar open till 12:00am' };
  }
  if (openToday && minutes < schedule.open) {
    return { open: false, label: 'Closed · opens today 6:00pm' };
  }
  let next = (day + 1) % 7;
  while (schedule.closedDays.includes(next)) next = (next + 1) % 7;
  return { open: false, label: `Closed · opens ${DAY_NAMES[next]} 6:00pm` };
}

export function formatReceiptDate(date = new Date()) {
  const d = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const t = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${d} ${t}`;
}
