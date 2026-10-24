// DMU Sport demo data: clubs, programmes, S&C and societies. Prices and times are demo values.
import { startOfDay } from '@/data';

export type Venue = 'Beaumont Park' | 'The Watershed' | 'QEII Leisure Centre';

export type Training = { day: number; time: string; minutes: number; venue: Venue; label: string };

export type Club = {
  id: string;
  name: string;
  icon: string;
  fee: 40 | 60;
  teams: string[];
  blurb: string;
  training: Training[];
  bucs?: boolean;
};

// day: 0 = Sunday
export const CLUBS: Club[] = [
  { id: 'rugby', name: 'Rugby Union', icon: 'american-football', fee: 60, teams: ["Men's 1st XV", "Men's 2nd XV", "Women's XV"], bucs: true, blurb: 'From touch and tag to 15-a-side BUCS league rugby.', training: [{ day: 2, time: '18:00', minutes: 90, venue: 'Beaumont Park', label: 'Training' }, { day: 4, time: '18:00', minutes: 90, venue: 'Beaumont Park', label: 'Training' }, { day: 3, time: '13:00', minutes: 120, venue: 'Beaumont Park', label: 'BUCS fixture' }] },
  { id: 'football', name: 'Football', icon: 'football', fee: 60, teams: ["Men's 1sts", "Men's 2nds", "Women's 1sts"], bucs: true, blurb: 'Casual kickabouts to competitive BUCS teams for men and women.', training: [{ day: 1, time: '19:00', minutes: 90, venue: 'Beaumont Park', label: 'Training' }, { day: 4, time: '19:00', minutes: 90, venue: 'Beaumont Park', label: 'Training' }, { day: 3, time: '14:00', minutes: 120, venue: 'Beaumont Park', label: 'BUCS fixture' }] },
  { id: 'netball', name: 'Netball', icon: 'basketball-outline', fee: 40, teams: ['1st Team', '2nd Team', 'Development'], bucs: true, blurb: 'A multi-tier club from casual games to competitive leagues.', training: [{ day: 1, time: '18:00', minutes: 90, venue: 'The Watershed', label: 'Training' }, { day: 3, time: '15:00', minutes: 90, venue: 'The Watershed', label: 'BUCS fixture' }] },
  { id: 'basketball', name: 'Basketball', icon: 'basketball', fee: 40, teams: ["Men's 1sts", "Women's 1sts"], bucs: true, blurb: 'Regular court time, social games and BUCS league play.', training: [{ day: 2, time: '20:00', minutes: 90, venue: 'QEII Leisure Centre', label: 'Training' }, { day: 5, time: '18:00', minutes: 90, venue: 'QEII Leisure Centre', label: 'Training' }] },
  { id: 'hockey', name: 'Hockey', icon: 'trophy', fee: 60, teams: ["Men's 1sts", "Women's 1sts"], bucs: true, blurb: 'Played on artificial turf, from social to competitive leagues.', training: [{ day: 1, time: '20:00', minutes: 90, venue: 'Beaumont Park', label: 'Training' }, { day: 3, time: '13:30', minutes: 120, venue: 'Beaumont Park', label: 'BUCS fixture' }] },
  { id: 'american-football', name: 'American Football', icon: 'american-football-outline', fee: 60, teams: ['Contact Team', 'Flag Team'], bucs: true, blurb: 'Pads on, playbook out. No experience needed to start.', training: [{ day: 2, time: '19:00', minutes: 120, venue: 'Beaumont Park', label: 'Training' }, { day: 0, time: '12:00', minutes: 180, venue: 'Beaumont Park', label: 'Game day' }] },
  { id: 'volleyball', name: 'Volleyball', icon: 'tennisball', fee: 40, teams: ["Men's", "Women's", 'Social'], bucs: true, blurb: 'Social drop-ins, skills courses and national competition.', training: [{ day: 4, time: '20:00', minutes: 90, venue: 'The Watershed', label: 'Training' }] },
  { id: 'cheerleading', name: 'Cheerleading', icon: 'star', fee: 60, teams: ['Competition Squad', 'Pom Squad'], blurb: 'Dance, tumbling and stunts, up to national championships.', training: [{ day: 1, time: '18:30', minutes: 120, venue: 'The Watershed', label: 'Training' }, { day: 5, time: '17:00', minutes: 120, venue: 'The Watershed', label: 'Stunt session' }] },
  { id: 'boxing', name: 'Boxing', icon: 'fitness', fee: 40, teams: ['Club squad'], blurb: 'Fitness-first boxing for every gender, with a route to competing.', training: [{ day: 2, time: '17:00', minutes: 90, venue: 'The Watershed', label: 'Training' }, { day: 4, time: '17:00', minutes: 90, venue: 'The Watershed', label: 'Sparring' }] },
  { id: 'futsal', name: 'Futsal', icon: 'football-outline', fee: 40, teams: ["Men's", "Women's"], bucs: true, blurb: 'Fast, technical five-a-side football indoors.', training: [{ day: 3, time: '19:00', minutes: 90, venue: 'QEII Leisure Centre', label: 'Training' }] },
  { id: 'barbell', name: 'Powerlifting (Barbell)', icon: 'barbell', fee: 40, teams: ['Club squad'], blurb: 'Squat, bench and deadlift with a friendly, strong crew.', training: [{ day: 6, time: '11:00', minutes: 120, venue: 'The Watershed', label: 'Team session' }] },
  { id: 'swimming', name: 'Swimming', icon: 'water', fee: 40, teams: ['Performance', 'Recreational'], bucs: true, blurb: 'Lane training and technique at the QEII pool.', training: [{ day: 1, time: '07:00', minutes: 60, venue: 'QEII Leisure Centre', label: 'Lane training' }, { day: 4, time: '07:00', minutes: 60, venue: 'QEII Leisure Centre', label: 'Lane training' }] },
];

export const clubById = (id?: string) => CLUBS.find((c) => c.id === id);

export type SncPlan = { id: string; name: string; price: number; period: 'year' | 'term'; tagline: string; perks: string[] };

export const SNC_PLANS: SncPlan[] = [
  { id: 'athlete', name: 'Club Athlete', price: 30, period: 'year', tagline: 'For DMU Team members', perks: ['Coached S&C sessions at the Watershed', 'Programme built around your season', 'Injury-prevention screening'] },
  { id: 'open', name: 'Open S&C', price: 45, period: 'year', tagline: 'For any student', perks: ['Access to the S&C suite', 'Two coached sessions a week', 'Lifting technique workshops'] },
];

export const SNC_SESSIONS: Training[] = [
  { day: 1, time: '07:30', minutes: 60, venue: 'The Watershed', label: 'Coached S&C' },
  { day: 3, time: '16:00', minutes: 60, venue: 'The Watershed', label: 'Coached S&C' },
  { day: 5, time: '07:30', minutes: 60, venue: 'The Watershed', label: 'Power and speed' },
];

export type Society = { id: string; name: string; icon: string; fee: number; members: number; blurb: string };

export const SOCIETIES: Society[] = [
  { id: 'esports', name: 'Esports Society', icon: 'game-controller', fee: 5, members: 214, blurb: 'Weekly scrims, uni leagues and LAN nights.' },
  { id: 'dance', name: 'Dance Society', icon: 'musical-notes', fee: 10, members: 180, blurb: 'Hip hop, commercial and contemporary classes.' },
  { id: 'hiking', name: 'Hiking Society', icon: 'trail-sign', fee: 8, members: 96, blurb: 'Peak District trips most weekends.' },
  { id: 'chess', name: 'Chess Society', icon: 'grid', fee: 3, members: 58, blurb: 'Casual games, coaching and county matches.' },
  { id: 'film', name: 'Film Society', icon: 'film', fee: 5, members: 132, blurb: 'Screenings, film-making and festival trips.' },
  { id: 'baking', name: 'Baking Society', icon: 'restaurant', fee: 5, members: 77, blurb: 'Bake-offs, socials and charity sales.' },
];

export const societyById = (id?: string) => SOCIETIES.find((s) => s.id === id);

export type Programme = {
  id: 'active' | 'learn' | 'campus';
  name: string;
  tagline: string;
  blurb: string;
  photo: number;
  sessions: { title: string; day: number; time: string; minutes: number; venue: Venue; price: number }[];
};

export const PROGRAMMES: Programme[] = [
  {
    id: 'active',
    name: 'DMU Active',
    tagline: 'Movement for your wellbeing',
    blurb: 'Free and low-cost sessions to get moving, de-stress and meet people. No experience, no pressure.',
    photo: require('@/assets/photos/active.jpg'),
    sessions: [
      { title: 'Social Badminton', day: 1, time: '17:00', minutes: 60, venue: 'QEII Leisure Centre', price: 0 },
      { title: 'Walking Netball', day: 2, time: '12:00', minutes: 45, venue: 'The Watershed', price: 0 },
      { title: 'Mindful Yoga', day: 3, time: '17:30', minutes: 50, venue: 'The Watershed', price: 0 },
      { title: 'Couch to 5K', day: 4, time: '17:00', minutes: 45, venue: 'The Watershed', price: 0 },
    ],
  },
  {
    id: 'learn',
    name: 'DMU Learn',
    tagline: 'Learn new sports with new people',
    blurb: 'Beginner courses taught by qualified coaches. Try something you have never done before.',
    photo: require('@/assets/photos/climb.jpg'),
    sessions: [
      { title: 'Learn to Climb', day: 2, time: '18:00', minutes: 90, venue: 'QEII Leisure Centre', price: 3 },
      { title: 'Learn to Swim', day: 3, time: '18:00', minutes: 45, venue: 'QEII Leisure Centre', price: 3 },
      { title: 'Learn to Box', day: 4, time: '18:30', minutes: 60, venue: 'The Watershed', price: 3 },
      { title: 'Learn to Row', day: 6, time: '10:00', minutes: 90, venue: 'The Watershed', price: 3 },
    ],
  },
  {
    id: 'campus',
    name: 'DMU Campus',
    tagline: 'Student tournaments and leagues',
    blurb: 'Social leagues and one-day tournaments. Bring your mates or join a team on the night.',
    photo: require('@/assets/photos/leagues.jpg'),
    sessions: [
      { title: 'Five-a-side League', day: 1, time: '19:00', minutes: 60, venue: 'The Watershed', price: 2 },
      { title: 'Netball League', day: 2, time: '19:00', minutes: 60, venue: 'The Watershed', price: 2 },
      { title: 'Dodgeball Tournament', day: 3, time: '18:00', minutes: 120, venue: 'QEII Leisure Centre', price: 2 },
      { title: 'Badminton Doubles League', day: 4, time: '19:00', minutes: 60, venue: 'QEII Leisure Centre', price: 2 },
    ],
  },
];

export const programmeById = (id?: string) => PROGRAMMES.find((p) => p.id === id);

export type TeamEvent = { id: string; title: string; label: string; subtitle: string; start: string; minutes: number; venue: Venue; kind: 'team' | 'snc' };

// The next week of sessions for a weekly schedule.
export function upcomingFrom(schedule: Training[], idPrefix: string, title: (t: Training) => string, subtitle: string, kind: TeamEvent['kind'], from = new Date()): TeamEvent[] {
  const base = startOfDay(from);
  const out: TeamEvent[] = [];
  for (let i = 0; i < 8; i++) {
    const day = new Date(base);
    day.setDate(base.getDate() + i);
    for (const t of schedule) {
      if (t.day !== day.getDay()) continue;
      const [h, m] = t.time.split(':').map(Number);
      const start = new Date(day);
      start.setHours(h, m, 0, 0);
      if (start.getTime() + t.minutes * 60000 < from.getTime()) continue;
      out.push({ id: `${idPrefix}-${start.toISOString()}`, title: title(t), label: t.label, subtitle, start: start.toISOString(), minutes: t.minutes, venue: t.venue, kind });
    }
  }
  return out.sort((a, b) => a.start.localeCompare(b.start));
}

export function teamEvents(clubId: string, team: string, from = new Date()) {
  const club = clubById(clubId);
  if (!club) return [];
  const short = club.name.replace(' Union', '').replace(/ \(.*\)/, '');
  return upcomingFrom(club.training, `${clubId}-${team}`, (t) => `${short} ${team} ${t.label.replace(/^(\w)(?![A-Z])/, (c) => c.toLowerCase())}`, club.name, 'team', from);
}

export const sncEvents = (from = new Date()) => upcomingFrom(SNC_SESSIONS, 'snc', (t) => t.label, 'DMU Team S&C', 'snc', from);

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
