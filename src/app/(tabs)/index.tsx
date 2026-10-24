import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Lion } from '@/components/brand';
import { SessionRow } from '@/components/session-row';
import { Badge, Button, Card, Press, Row, Screen, SectionTitle, T } from '@/components/ui';
import { CATEGORIES, gymBusyness, HOURS, PLANS, SESSIONS } from '@/data';
import { dayLabel, endTime, greeting, relative, time } from '@/format';
import { upcomingBookings, useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

export default function Home() {
  const { user, bookings, membership } = useStore();
  const now = new Date();
  const next = upcomingBookings(bookings, now)[0];
  const upNext = SESSIONS.filter((s) => new Date(s.start) > now).slice(0, 4);
  const initials = `${user?.firstName[0] ?? ''}${user?.lastName[0] ?? ''}`;

  return (
    <Screen tabs>
      <Animated.View entering={FadeInDown.duration(500)}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <T v="small" color={colors.textMuted}>
              {greeting(now)}
            </T>
            <T v="hero">{user?.firstName}</T>
          </View>
          <Press onPress={() => router.push('/account')} style={styles.avatar}>
            <T v="bodyBold" color={colors.white}>
              {initials}
            </T>
          </Press>
        </Row>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(500)} style={{ marginTop: space.xl }}>
        {next ? (
          <Press onPress={() => router.push({ pathname: '/class/[id]', params: { id: next.session.id } })} scaleTo={0.98}>
            <LinearGradient colors={[colors.red, colors.redDeep]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
              <View style={{ position: 'absolute', right: -30, top: -20, opacity: 0.18 }}>
                <Lion size={200} color="white" />
              </View>
              <Badge label={relative(next.session.start, now)} tone="dark" icon="time" />
              <T v="title" color={colors.white} style={{ marginTop: space.lg }}>
                {next.session.title}
              </T>
              <T v="body" color="rgba(255,255,255,0.8)">
                {dayLabel(next.session.start, now)} · {time(next.session.start)}–{endTime(next.session.start, next.session.minutes)}
              </T>
              <Row style={{ marginTop: space.xl, justifyContent: 'space-between' }}>
                <Row gap={6}>
                  <Ionicons name="location" size={15} color="rgba(255,255,255,0.8)" />
                  <T v="smallBold" color={colors.white}>
                    {next.session.location}
                  </T>
                </Row>
                <Row gap={4}>
                  <T v="smallBold" color={colors.white}>
                    Entry code
                  </T>
                  <Ionicons name="qr-code" size={16} color={colors.white} />
                </Row>
              </Row>
            </LinearGradient>
          </Press>
        ) : (
          <Card dark style={styles.hero}>
            <View style={{ position: 'absolute', right: -30, top: -20, opacity: 0.22 }}>
              <Lion size={200} color="red" />
            </View>
            <T v="overline" color={colors.red}>
              Nothing booked yet
            </T>
            <T v="title" color={colors.white} style={{ marginTop: space.sm, maxWidth: 230 }}>
              Your next session is two taps away.
            </T>
            <Button title="Find a class" kind="primary" size="md" icon="search" onPress={() => router.push('/book')} style={{ alignSelf: 'flex-start', marginTop: space.xl }} />
          </Card>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(500)}>
        <LiveStatus now={now} />
      </Animated.View>

      <SectionTitle title="Book something" action="See all" onAction={() => router.push('/book')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.xl }} contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.md }}>
        {CATEGORIES.map((c) => (
          <Press key={c.id} onPress={() => router.push({ pathname: '/book', params: { cat: c.id } })} style={styles.catCard}>
            <Image source={c.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient colors={['transparent', 'rgba(11,11,12,0.85)']} style={StyleSheet.absoluteFill} />
            <View style={styles.catIcon}>
              <Ionicons name={c.icon as never} size={16} color={colors.white} />
            </View>
            <T v="heading" color={colors.white} style={{ position: 'absolute', left: 14, bottom: 12 }}>
              {c.label}
            </T>
          </Press>
        ))}
      </ScrollView>

      {!membership && (
        <Press onPress={() => router.push('/join')} scaleTo={0.98} style={{ marginTop: space.xxl }}>
          <Card style={{ padding: space.xl, flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
            <View style={{ flex: 1 }}>
              <T v="overline" color={colors.red}>
                Membership
              </T>
              <T v="heading" style={{ marginTop: 4 }}>
                Go unlimited for £{PLANS[0].price}/month
              </T>
              <T v="small" color={colors.textMuted} style={{ marginTop: 2 }}>
                Every class, gym and swim included. Join in under a minute.
              </T>
            </View>
            <View style={styles.arrow}>
              <Ionicons name="arrow-forward" size={20} color={colors.white} />
            </View>
          </Card>
        </Press>
      )}

      <SectionTitle title="Up next" action="Timetable" onAction={() => router.push('/book')} />
      {upNext.map((s) => (
        <SessionRow key={s.id} session={s} />
      ))}

      <Press onPress={() => router.push('/centre')} scaleTo={0.99} style={{ marginTop: space.lg }}>
        <Row style={{ justifyContent: 'center' }} gap={6}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <T v="smallBold" color={colors.textMuted}>
            Opening hours and centre info
          </T>
        </Row>
      </Press>
    </Screen>
  );
}

function LiveStatus({ now }: { now: Date }) {
  const today = HOURS[now.getDay()];
  const hm = now.getHours() * 60 + now.getMinutes();
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  const open = hm >= toMin(today.open) && hm < toMin(today.close);
  const busy = gymBusyness(now);
  const label = busy < 0.35 ? 'Quiet' : busy < 0.65 ? 'Steady' : 'Busy';
  const tone = busy < 0.35 ? colors.green : busy < 0.65 ? colors.amber : colors.red;
  const hours = Array.from({ length: 16 }, (_, i) => 6 + i);

  return (
    <Card style={{ marginTop: space.lg, padding: space.lg }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <T v="caption" color={colors.textMuted}>
            Gym right now
          </T>
          <Row gap={8} style={{ marginTop: 2 }}>
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: tone }} />
            <T v="heading">{open ? label : 'Closed'}</T>
          </Row>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Badge label={open ? `Open until ${today.close}` : `Opens ${today.open}`} tone={open ? 'green' : 'neutral'} />
        </View>
      </Row>
      <Row gap={4} style={{ marginTop: space.lg, alignItems: 'flex-end', height: 44 }}>
        {hours.map((h) => {
          const d = new Date(now);
          d.setHours(h, 0, 0, 0);
          const v = gymBusyness(d);
          const current = h === now.getHours();
          return <View key={h} style={{ flex: 1, height: 6 + v * 38, borderRadius: 4, backgroundColor: current ? tone : colors.line }} />;
        })}
      </Row>
      <Row style={{ justifyContent: 'space-between', marginTop: 6 }}>
        {['6am', '12pm', '6pm', '9pm'].map((l) => (
          <T key={l} v="caption" color={colors.textFaint}>
            {l}
          </T>
        ))}
      </Row>
    </Card>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  hero: { borderRadius: radius.xl, padding: space.xl, overflow: 'hidden', minHeight: 190 },
  catCard: { width: 140, height: 170, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.ink, ...shadow },
  catIcon: { position: 'absolute', top: 12, left: 12, width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(168,29,53,0.95)', alignItems: 'center', justifyContent: 'center' },
  arrow: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
});
