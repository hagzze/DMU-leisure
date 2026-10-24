import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { PLANS, Session, sessionById } from '@/data';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  phone: string;
  dob: string;
};

export type Card = { brand: 'Visa' | 'Mastercard' | 'Amex'; last4: string; expiry: string; name: string };

export type Booking = { id: string; sessionId: string; bookedAt: string; paid: number; method: 'membership' | 'applepay' | 'card' };

export type Membership = { planId: string; since: string; number: string };

export type ClubMembership = { clubId: string; team: string; since: string; number: string };
export type SncMembership = { planId: string; since: string; number: string };
export type SocietyMembership = { societyId: string; since: string };
export type Activity = { id: string; title: string; subtitle: string; start: string; minutes: number; location: string; paid: number };

type State = {
  user: User | null;
  card: Card | null;
  bookings: Booking[];
  membership: Membership | null;
  clubs: ClubMembership[];
  snc: SncMembership | null;
  societies: SocietyMembership[];
  activities: Activity[];
  // event id -> scheduled notification id
  reminders: Record<string, string>;
};

const STORAGE_KEY = 'dmu-leisure/v1';

const DEMO_USER: User = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'p2581234@my365.dmu.ac.uk',
  studentId: 'P2581234',
  phone: '07700 900123',
  dob: '14/03/2004',
};

const DEMO_CARD: Card = { brand: 'Visa', last4: '4242', expiry: '09/28', name: 'Alex Morgan' };

const EMPTY: State = { user: null, card: null, bookings: [], membership: null, clubs: [], snc: null, societies: [], activities: [], reminders: {} };

const memberNumber = (prefix: string) => `${prefix}${Math.floor(10000000 + Math.random() * 89999999)}`;

type Store = State & {
  ready: boolean;
  signIn: (email?: string) => void;
  signOut: () => void;
  book: (session: Session, method: Booking['method']) => Booking;
  cancel: (bookingId: string) => void;
  isBooked: (sessionId: string) => Booking | undefined;
  spacesLeft: (session: Session) => number;
  join: (planId: string, details: Partial<User>) => void;
  leaveMembership: () => void;
  saveCard: (card: Card | null) => void;
  updateUser: (patch: Partial<User>) => void;
  joinClub: (clubId: string, team: string, details: Partial<User>) => void;
  leaveClub: (clubId: string) => void;
  joinSnc: (planId: string, details: Partial<User>) => void;
  joinSociety: (societyId: string, details: Partial<User>) => void;
  setReminder: (eventId: string, notificationId: string | null) => void;
  bookActivity: (a: Activity) => void;
  cancelActivity: (id: string) => void;
  resetDemo: () => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  // Load once: this is what keeps people signed in between launches.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const store: Store = {
    ...state,
    ready,
    signIn: (email) =>
      setState((s) => ({
        ...s,
        user: { ...DEMO_USER, ...(email ? { email } : null) },
        card: s.card ?? DEMO_CARD,
      })),
    signOut: () => setState((s) => ({ ...s, user: null })),
    book: (session, method) => {
      const booking: Booking = {
        id: `b-${Date.now()}`,
        sessionId: session.id,
        bookedAt: new Date().toISOString(),
        paid: method === 'membership' ? 0 : session.price,
        method,
      };
      setState((s) => ({ ...s, bookings: [...s.bookings, booking] }));
      return booking;
    },
    cancel: (bookingId) => setState((s) => ({ ...s, bookings: s.bookings.filter((b) => b.id !== bookingId) })),
    isBooked: (sessionId) => state.bookings.find((b) => b.sessionId === sessionId),
    spacesLeft: (session) => {
      const mine = state.bookings.some((b) => b.sessionId === session.id) ? 1 : 0;
      return Math.max(0, session.capacity - session.taken - mine);
    },
    join: (planId, details) =>
      setState((s) => ({
        ...s,
        user: s.user ? { ...s.user, ...details } : s.user,
        membership: { planId, since: new Date().toISOString(), number: memberNumber('DMU') },
      })),
    leaveMembership: () => setState((s) => ({ ...s, membership: null })),
    saveCard: (card) => setState((s) => ({ ...s, card })),
    updateUser: (patch) => setState((s) => ({ ...s, user: s.user ? { ...s.user, ...patch } : s.user })),
    joinClub: (clubId, team, details) =>
      setState((s) => ({
        ...s,
        user: s.user ? { ...s.user, ...details } : s.user,
        clubs: [...s.clubs.filter((c) => c.clubId !== clubId), { clubId, team, since: new Date().toISOString(), number: memberNumber('TEAM') }],
      })),
    leaveClub: (clubId) => setState((s) => ({ ...s, clubs: s.clubs.filter((c) => c.clubId !== clubId) })),
    joinSnc: (planId, details) =>
      setState((s) => ({
        ...s,
        user: s.user ? { ...s.user, ...details } : s.user,
        snc: { planId, since: new Date().toISOString(), number: memberNumber('SNC') },
      })),
    joinSociety: (societyId, details) =>
      setState((s) => ({
        ...s,
        user: s.user ? { ...s.user, ...details } : s.user,
        societies: [...s.societies.filter((x) => x.societyId !== societyId), { societyId, since: new Date().toISOString() }],
      })),
    bookActivity: (a) => setState((s) => ({ ...s, activities: [...s.activities.filter((x) => x.id !== a.id), a] })),
    cancelActivity: (id) => setState((s) => ({ ...s, activities: s.activities.filter((x) => x.id !== id) })),
    setReminder: (eventId, notificationId) =>
      setState((s) => {
        const { [eventId]: _old, ...rest } = s.reminders;
        return { ...s, reminders: notificationId ? { ...rest, [eventId]: notificationId } : rest };
      }),
    resetDemo: () => setState(EMPTY),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}

export const planById = (id?: string) => PLANS.find((p) => p.id === id);

export function upcomingBookings(bookings: Booking[], now = new Date()) {
  return bookings
    .map((b) => ({ booking: b, session: sessionById(b.sessionId)! }))
    .filter((x) => x.session && new Date(x.session.start).getTime() + x.session.minutes * 60000 > now.getTime())
    .sort((a, b) => a.session.start.localeCompare(b.session.start));
}
