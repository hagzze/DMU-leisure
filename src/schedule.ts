import { categoryOf, sessionById } from '@/data';
import { clubById, sncEvents, teamEvents } from '@/sport';
import type { Activity, Booking, ClubMembership, SncMembership } from '@/store';

export type UpcomingItem = {
  id: string;
  title: string;
  subtitle: string;
  start: string;
  minutes: number;
  location: string;
  kind: 'booking' | 'team' | 'snc' | 'activity';
  icon: string;
  href: { pathname: string; params?: Record<string, string> };
};

// Everything the user has coming up: leisure bookings, team training and S&C sessions.
export function myUpcoming(
  { bookings, clubs, snc, activities = [] }: { bookings: Booking[]; clubs: ClubMembership[]; snc: SncMembership | null; activities?: Activity[] },
  now = new Date(),
): UpcomingItem[] {
  const items: UpcomingItem[] = [];
  for (const b of bookings) {
    const s = sessionById(b.sessionId);
    if (!s || new Date(s.start).getTime() + s.minutes * 60000 < now.getTime()) continue;
    items.push({
      id: b.id,
      title: s.title,
      subtitle: 'QEII Leisure Centre',
      start: s.start,
      minutes: s.minutes,
      location: s.location,
      kind: 'booking',
      icon: categoryOf(s.category).icon,
      href: { pathname: '/class/[id]', params: { id: s.id } },
    });
  }
  for (const c of clubs) {
    const club = clubById(c.clubId);
    for (const e of teamEvents(c.clubId, c.team, now)) {
      items.push({ id: e.id, title: e.title, subtitle: 'DMU Team', start: e.start, minutes: e.minutes, location: e.venue, kind: 'team', icon: club?.icon ?? 'people', href: { pathname: '/sport/club/[id]', params: { id: c.clubId } } });
    }
  }
  if (snc) {
    for (const e of sncEvents(now)) {
      items.push({ id: e.id, title: e.title, subtitle: 'Strength & Conditioning', start: e.start, minutes: e.minutes, location: e.venue, kind: 'snc', icon: 'barbell', href: { pathname: '/sport/snc' } });
    }
  }
  for (const a of activities) {
    if (new Date(a.start).getTime() + a.minutes * 60000 < now.getTime()) continue;
    items.push({ id: a.id, title: a.title, subtitle: a.subtitle, start: a.start, minutes: a.minutes, location: a.location, kind: 'activity', icon: 'flash', href: { pathname: '/bookings' } });
  }
  return items.sort((a, b) => a.start.localeCompare(b.start));
}
