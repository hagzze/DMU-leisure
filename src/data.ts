// Demo data for the pitch prototype. Nothing here comes from DMU's live systems.

export type Category = 'gym' | 'swim' | 'classes' | 'activities' | 'climb';

export type Session = {
  id: string;
  title: string;
  category: Category;
  start: string; // ISO
  minutes: number;
  location: string;
  instructor?: string;
  capacity: number;
  taken: number;
  price: number; // pay-as-you-go price in pounds
  intensity: 1 | 2 | 3;
  blurb: string;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  tagline: string;
  perks: string[];
  popular?: boolean;
};

export const CENTRE = {
  name: 'QEII Diamond Jubilee Leisure Centre',
  short: 'QEII Leisure Centre',
  address: 'Duns Lane, Leicester',
};

// Opening hours, 0 = Sunday.
export const HOURS: { day: string; open: string; close: string }[] = [
  { day: 'Sunday', open: '08:00', close: '20:00' },
  { day: 'Monday', open: '06:30', close: '22:00' },
  { day: 'Tuesday', open: '06:30', close: '22:00' },
  { day: 'Wednesday', open: '06:30', close: '22:00' },
  { day: 'Thursday', open: '06:30', close: '22:00' },
  { day: 'Friday', open: '06:30', close: '21:00' },
  { day: 'Saturday', open: '08:00', close: '20:00' },
];

export const CATEGORIES: { id: Category; label: string; icon: string; photo: number }[] = [
  { id: 'gym', label: 'Gym', icon: 'barbell', photo: require('@/assets/photos/gym.jpg') },
  { id: 'classes', label: 'Classes', icon: 'flash', photo: require('@/assets/photos/classes.jpg') },
  { id: 'swim', label: 'Swim', icon: 'water', photo: require('@/assets/photos/swim.jpg') },
  { id: 'climb', label: 'Climb', icon: 'trending-up', photo: require('@/assets/photos/climb.jpg') },
  { id: 'activities', label: 'Sports', icon: 'basketball', photo: require('@/assets/photos/activities.jpg') },
];

export const categoryOf = (id: Category) => CATEGORIES.find((c) => c.id === id)!;

export const PLANS: Plan[] = [
  {
    id: 'unlimited',
    name: 'Student Unlimited',
    price: 22,
    period: 'month',
    tagline: 'Everything, any time',
    perks: ['Gym, swim and climb any time', 'Unlimited classes', 'Book 7 days ahead', 'Cancel any time'],
    popular: true,
  },
  {
    id: 'offpeak',
    name: 'Student Off-Peak',
    price: 15,
    period: 'month',
    tagline: 'Weekdays before 4pm, all weekend',
    perks: ['Gym and swim off-peak', '4 classes a month', 'Book 5 days ahead'],
  },
  {
    id: 'annual',
    name: 'Student Annual',
    price: 199,
    period: 'year',
    tagline: 'Two months free',
    perks: ['Everything in Unlimited', 'Free guest pass each month', 'Priority booking'],
  },
];

type Template = Omit<Session, 'id' | 'start' | 'taken'> & { time: string; days: number[] };

// Weekly timetable. days: 0 = Sunday.
const WEEK: Template[] = [
  { title: 'Spin', category: 'classes', time: '07:15', minutes: 45, location: 'Spin Studio', instructor: 'Jess', capacity: 24, price: 5, intensity: 3, blurb: 'High-energy indoor cycling to big tunes. Bring water and a towel.', days: [1, 3, 5] },
  { title: 'Boot Camp', category: 'classes', time: '07:15', minutes: 45, location: 'Sports Hall', instructor: 'Marcus', capacity: 30, price: 5, intensity: 3, blurb: 'Circuits, sprints and bodyweight work. Start your day strong.', days: [2, 4] },
  { title: 'Lane Swim', category: 'swim', time: '07:00', minutes: 60, location: 'Main Pool', capacity: 40, price: 3.5, intensity: 2, blurb: 'Fast, medium and slow lanes. Swim at your own pace.', days: [1, 2, 3, 4, 5] },
  { title: 'Gym Session', category: 'gym', time: '09:00', minutes: 90, location: 'Fitness Suite', capacity: 60, price: 4, intensity: 2, blurb: 'Full access to the fitness suite and free weights area.', days: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Yoga Flow', category: 'classes', time: '12:15', minutes: 50, location: 'QE2 Studio', instructor: 'Priya', capacity: 20, price: 5, intensity: 1, blurb: 'Breath-led vinyasa to build strength and mobility. All levels welcome.', days: [1, 3, 5] },
  { title: 'HIIT 30', category: 'classes', time: '12:15', minutes: 30, location: 'QE2 Studio', instructor: 'Marcus', capacity: 20, price: 5, intensity: 3, blurb: 'Thirty minutes, flat out. Intervals that fit in a lunch break.', days: [2, 4] },
  { title: 'Climbing Wall', category: 'climb', time: '13:00', minutes: 120, location: 'Climbing Wall', capacity: 16, price: 6, intensity: 2, blurb: 'Bouldering and top-rope. Kit hire available at reception.', days: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Public Swim', category: 'swim', time: '14:00', minutes: 60, location: 'Main Pool', capacity: 60, price: 3.5, intensity: 1, blurb: 'Open swim for everyone. Floats available.', days: [0, 3, 6] },
  { title: 'Badminton Court', category: 'activities', time: '15:00', minutes: 60, location: 'Sports Hall', capacity: 4, price: 8, intensity: 2, blurb: 'One court for up to four players. Rackets and shuttles to hire.', days: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Gym Session', category: 'gym', time: '16:00', minutes: 90, location: 'Fitness Suite', capacity: 60, price: 4, intensity: 2, blurb: 'Full access to the fitness suite and free weights area.', days: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Pilates', category: 'classes', time: '17:30', minutes: 45, location: 'QE2 Studio', instructor: 'Hannah', capacity: 18, price: 5, intensity: 1, blurb: 'Core strength, posture and control. Mats provided.', days: [2, 4] },
  { title: 'Zumba', category: 'classes', time: '17:30', minutes: 45, location: 'QE2 Studio', instructor: 'Carla', capacity: 25, price: 5, intensity: 2, blurb: 'Latin-inspired dance workout. No experience needed, just energy.', days: [1, 3] },
  { title: 'Aqua Fit', category: 'swim', time: '18:00', minutes: 45, location: 'Main Pool', instructor: 'Jess', capacity: 25, price: 5, intensity: 2, blurb: 'Low-impact, high-fun workout in the shallow end.', days: [2, 5] },
  { title: 'Body Pump', category: 'classes', time: '18:30', minutes: 55, location: 'QE2 Studio', instructor: 'Dan', capacity: 22, price: 5, intensity: 3, blurb: 'Barbell workout to music. Light weights, lots of reps.', days: [1, 3, 5] },
  { title: 'Boxfit', category: 'classes', time: '18:30', minutes: 45, location: 'Sports Hall', instructor: 'Marcus', capacity: 24, price: 5, intensity: 3, blurb: 'Pads, gloves and conditioning. Gloves provided.', days: [2, 4] },
  { title: 'Five-a-side Pitch', category: 'activities', time: '19:00', minutes: 60, location: 'Sports Hall', capacity: 10, price: 30, intensity: 3, blurb: 'Indoor five-a-side for your squad. Price is per pitch.', days: [1, 2, 3, 4] },
  { title: 'Gym Session', category: 'gym', time: '19:30', minutes: 90, location: 'Fitness Suite', capacity: 60, price: 4, intensity: 2, blurb: 'Full access to the fitness suite and free weights area.', days: [0, 1, 2, 3, 4, 5] },
  { title: 'Sunday Stretch', category: 'classes', time: '10:00', minutes: 40, location: 'QE2 Studio', instructor: 'Priya', capacity: 20, price: 5, intensity: 1, blurb: 'Slow, deep stretching to reset for the week.', days: [0] },
  { title: 'Saturday Spin', category: 'classes', time: '09:30', minutes: 45, location: 'Spin Studio', instructor: 'Dan', capacity: 24, price: 5, intensity: 3, blurb: 'The weekend ride. Big hills, bigger playlist.', days: [6] },
];

// Small deterministic hash so the demo looks the same every run.
function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function buildSessions(from = new Date(), days = 7): Session[] {
  const base = startOfDay(from);
  const out: Session[] = [];
  for (let i = 0; i < days; i++) {
    const day = new Date(base);
    day.setDate(base.getDate() + i);
    for (const t of WEEK) {
      if (!t.days.includes(day.getDay())) continue;
      const [h, m] = t.time.split(':').map(Number);
      const start = new Date(day);
      start.setHours(h, m, 0, 0);
      const id = `${t.title}-${start.toISOString()}`.replace(/\W+/g, '-').toLowerCase();
      const r = seed(id);
      // A few sessions are full, most are filling up.
      // A few small classes are full; big spaces like the gym and pool never are.
      const taken = r > 0.88 && t.capacity <= 30 ? t.capacity : Math.floor(t.capacity * (0.3 + r * 0.6));
      const { time, days: _d, ...rest } = t;
      out.push({ ...rest, id, start: start.toISOString(), taken });
    }
  }
  return out.sort((a, b) => a.start.localeCompare(b.start));
}

export const SESSIONS = buildSessions();

export const sessionById = (id: string) => SESSIONS.find((s) => s.id === id);

// Mock "how busy is the gym" curve by hour, 0..1.
export function gymBusyness(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  const peak = (c: number, w: number, a: number) => a * Math.exp(-((h - c) ** 2) / (2 * w * w));
  return Math.min(0.95, 0.12 + peak(7.5, 1, 0.35) + peak(12.5, 1.2, 0.4) + peak(18, 1.6, 0.7));
}
