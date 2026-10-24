import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { Badge, Button, Press, Row, Screen, T } from '@/components/ui';
import { categoryOf, sessionById } from '@/data';
import { dayLabel, endTime, money, time } from '@/format';
import { upcomingBookings, useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Bookings() {
  const { bookings } = useStore();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const upcoming = upcomingBookings(bookings);
  const upcomingIds = new Set(upcoming.map((u) => u.booking.id));
  const past = bookings
    .filter((b) => !upcomingIds.has(b.id))
    .map((b) => ({ booking: b, session: sessionById(b.sessionId) }))
    .filter((x) => x.session);
  const list = tab === 'upcoming' ? upcoming : past;
  const spent = bookings.reduce((n, b) => n + b.paid, 0);

  return (
    <Screen tabs>
      <T v="overline" color={colors.red}>
        Your schedule
      </T>
      <T v="hero" style={{ marginTop: 2 }}>
        My bookings
      </T>

      <Row gap={space.md} style={{ marginTop: space.xl }}>
        <Stat label="Coming up" value={String(upcoming.length)} />
        <Stat label="This term" value={String(bookings.length)} />
        <Stat label="Spent" value={money(spent) === 'Free' ? '£0' : money(spent)} />
      </Row>

      <View style={{ flexDirection: 'row', backgroundColor: '#E9E9ED', borderRadius: radius.pill, padding: 4, marginTop: space.xl }}>
        {(['upcoming', 'past'] as const).map((t) => (
          <Press key={t} onPress={() => setTab(t)} scaleTo={0.98} style={{ flex: 1, height: 38, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: tab === t ? colors.surface : 'transparent', ...(tab === t ? shadow : null) }}>
            <T v="smallBold" color={tab === t ? colors.ink : colors.textMuted}>
              {t === 'upcoming' ? 'Upcoming' : 'Past'}
            </T>
          </Press>
        ))}
      </View>

      <View style={{ marginTop: space.lg }}>
        {list.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: space.xxxl }}>
            <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="ticket-outline" size={34} color={colors.red} />
            </View>
            <T v="heading" style={{ marginTop: space.lg }}>
              {tab === 'upcoming' ? 'No bookings yet' : 'Nothing here yet'}
            </T>
            <T v="small" color={colors.textMuted} center style={{ marginTop: 4, maxWidth: 260 }}>
              {tab === 'upcoming' ? 'Pick a class, a swim or a gym slot and it will show up here.' : 'Sessions you have been to will appear here.'}
            </T>
            {tab === 'upcoming' && <Button title="Browse timetable" size="md" onPress={() => router.push('/book')} style={{ marginTop: space.xl }} />}
          </View>
        )}

        {list.map(({ booking, session }, i) => {
          if (!session) return null;
          const d = new Date(session.start);
          const cat = categoryOf(session.category);
          return (
            <Animated.View key={booking.id} entering={FadeInDown.delay(i * 60).duration(400)} layout={LinearTransition}>
              <Press
                onPress={() => router.push({ pathname: '/class/[id]', params: { id: session.id } })}
                scaleTo={0.98}
                style={{ flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: space.md, overflow: 'hidden', opacity: tab === 'past' ? 0.6 : 1, ...shadow }}>
                <View style={{ width: 74, backgroundColor: i === 0 && tab === 'upcoming' ? colors.red : colors.ink, alignItems: 'center', justifyContent: 'center', paddingVertical: space.lg }}>
                  <T v="caption" color="rgba(255,255,255,0.7)">
                    {MONTHS[d.getMonth()]}
                  </T>
                  <T v="title" color={colors.white}>
                    {d.getDate()}
                  </T>
                </View>
                <View style={{ flex: 1, padding: space.lg }}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <T v="caption" color={colors.textMuted}>
                      {dayLabel(session.start)} · {time(session.start)}–{endTime(session.start, session.minutes)}
                    </T>
                    <Ionicons name={cat.icon as never} size={14} color={colors.textMuted} />
                  </Row>
                  <T v="heading" style={{ marginTop: 2 }}>
                    {session.title}
                  </T>
                  <T v="small" color={colors.textMuted}>
                    {session.location}
                  </T>
                  <Row gap={6} style={{ marginTop: space.sm }}>
                    <Badge label={booking.method === 'membership' ? 'Membership' : `${money(booking.paid)} · ${booking.method === 'applepay' ? 'Apple Pay' : 'Card'}`} tone={booking.method === 'membership' ? 'red' : 'neutral'} />
                  </Row>
                </View>
              </Press>
            </Animated.View>
          );
        })}
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: space.md, ...shadow }}>
      <T v="title">{value}</T>
      <T v="caption" color={colors.textMuted}>
        {label}
      </T>
    </View>
  );
}
