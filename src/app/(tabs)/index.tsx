import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Lion } from '@/components/brand';
import { BellButton } from '@/components/reminders';
import { SessionRow } from '@/components/session-row';
import { Badge, Button, Card, IconName, Press, Row, Screen, SectionTitle, T } from '@/components/ui';
import { gymBusyness, HOURS, PLANS, SESSIONS } from '@/data';
import { dayLabel, dayShort, endTime, greeting, relative, time } from '@/format';
import { myUpcoming, UpcomingItem } from '@/schedule';
import { useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

export default function Home() {
  const { user, bookings, clubs, snc, activities, membership } = useStore();
  const [now] = useState(() => new Date());
  const upcoming = myUpcoming({ bookings, clubs, snc, activities }, now);
  const next = upcoming[0];
  const today = SESSIONS.filter((s) => new Date(s.start) > now).slice(0, 3);
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
          <Press onPress={() => router.navigate('/account')} style={styles.avatar}>
            <T v="bodyBold" color={colors.white}>
              {initials}
            </T>
          </Press>
        </Row>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(500)} style={{ marginTop: space.xl }}>
        {next ? <NextUp item={next} now={now} /> : <EmptyHero />}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(500)}>
        <LiveStatus now={now} />
      </Animated.View>

      <SectionTitle title="Book" />
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ gap: space.md }}>
        <BookTile
          href="/qe2"
          photo={require('@/assets/photos/gym.jpg')}
          eyebrow="Book the leisure centre"
          title="QEII"
          chips={['Gym', 'Classes', 'Swim', 'Climb']}
        />
        <BookTile
          href="/sport"
          photo={require('@/assets/photos/clubs.jpg')}
          eyebrow="Book sport"
          title="DMU Sport"
          chips={['Teams', 'S&C', 'Leagues', 'Societies']}
        />
      </Animated.View>

      <Row gap={space.md} style={{ marginTop: space.md }}>
        <QuickTile icon="ticket-outline" title="Manage bookings" onPress={() => router.push('/bookings')} />
        <QuickTile icon="card-outline" title="Memberships" onPress={() => router.navigate('/account')} />
      </Row>

      {upcoming.length > 1 && (
        <>
          <SectionTitle title="Up next" />
          {upcoming.slice(1, 5).map((u) => (
            <UpcomingRow key={u.id} item={u} />
          ))}
        </>
      )}

      {!membership && (
        <Press onPress={() => router.push('/join')} scaleTo={0.98} style={{ marginTop: space.xxl }}>
          <Card style={{ padding: space.xl, flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
            <View style={{ flex: 1 }}>
              <T v="overline" color={colors.red}>
                Leisure membership
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

      <SectionTitle title="On at QEII today" action="Timetable" onAction={() => router.navigate('/qe2')} />
      {today.map((s) => (
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

function NextUp({ item, now }: { item: UpcomingItem; now: Date }) {
  const team = item.kind !== 'booking';
  return (
    <Press onPress={() => router.push(item.href as Href)} scaleTo={0.98}>
      <LinearGradient colors={team ? [colors.ink3, colors.ink] : [colors.red, colors.redDeep]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={{ position: 'absolute', right: -30, top: -20, opacity: team ? 0.3 : 0.18 }}>
          <Lion size={200} color={team ? 'red' : 'white'} />
        </View>
        <Row style={{ justifyContent: 'space-between' }}>
          <Badge label={`Up next · ${relative(item.start, now)}`} tone="dark" icon="time" />
          <BellButton item={item} dark />
        </Row>
        <T v="caption" color={team ? colors.red : 'rgba(255,255,255,0.75)'} style={{ marginTop: space.lg, textTransform: 'uppercase', letterSpacing: 1 }}>
          {item.subtitle}
        </T>
        <T v="title" color={colors.white} style={{ marginTop: 2 }}>
          {item.title}
        </T>
        <T v="body" color="rgba(255,255,255,0.8)">
          {dayLabel(item.start, now)} · {time(item.start)}–{endTime(item.start, item.minutes)}
        </T>
        <Row gap={6} style={{ marginTop: space.lg }}>
          <Ionicons name="location" size={15} color="rgba(255,255,255,0.8)" />
          <T v="smallBold" color={colors.white}>
            {item.location}
          </T>
        </Row>
      </LinearGradient>
    </Press>
  );
}

function EmptyHero() {
  return (
    <Card dark style={styles.hero}>
      <View style={{ position: 'absolute', right: -30, top: -20, opacity: 0.22 }}>
        <Lion size={200} color="red" />
      </View>
      <T v="overline" color={colors.red}>
        Nothing booked yet
      </T>
      <T v="title" color={colors.white} style={{ marginTop: space.sm, maxWidth: 240 }}>
        Your next session is two taps away.
      </T>
      <Row gap={space.sm} style={{ marginTop: space.xl }}>
        <Button title="Book QEII" size="md" onPress={() => router.navigate('/qe2')} />
        <Button title="Join a team" size="md" kind="light" onPress={() => router.push('/sport/team')} />
      </Row>
    </Card>
  );
}

function BookTile({ href, photo, eyebrow, title, chips }: { href: Href; photo: number; eyebrow: string; title: string; chips: string[] }) {
  return (
    <Press onPress={() => router.navigate(href)} scaleTo={0.98} style={styles.tile}>
      <Image source={photo} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={['rgba(11,11,12,0.05)', 'rgba(11,11,12,0.88)']} style={StyleSheet.absoluteFill} />
      <View style={{ position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg }}>
        <T v="overline" color={colors.white} style={{ opacity: 0.85 }}>
          {eyebrow}
        </T>
        <Row style={{ justifyContent: 'space-between', marginTop: 2 }}>
          <T v="title" color={colors.white}>
            {title}
          </T>
          <View style={styles.tileArrow}>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </View>
        </Row>
        <Row gap={6} style={{ marginTop: space.sm, flexWrap: 'wrap' }}>
          {chips.map((c) => (
            <Badge key={c} label={c} tone="dark" />
          ))}
        </Row>
      </View>
    </Press>
  );
}

function QuickTile({ icon, title, onPress }: { icon: IconName; title: string; onPress: () => void }) {
  return (
    <Press onPress={onPress} scaleTo={0.97} style={styles.quick}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={19} color={colors.red} />
      </View>
      <T v="smallBold" style={{ flex: 1 }}>
        {title}
      </T>
      <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
    </Press>
  );
}

export function UpcomingRow({ item }: { item: UpcomingItem }) {
  return (
    <Press onPress={() => router.push(item.href as Href)} scaleTo={0.98} style={styles.upRow}>
      <View style={[styles.upIcon, item.kind !== 'booking' && { backgroundColor: colors.ink }]}>
        <Ionicons name={item.icon as never} size={18} color={item.kind !== 'booking' ? colors.white : colors.red} />
      </View>
      <View style={{ flex: 1 }}>
        <T v="bodyBold" numberOfLines={2}>
          {item.title}
        </T>
        <T v="caption" color={colors.textMuted}>
          {dayShort(item.start)} · {time(item.start)} · {item.location}
        </T>
      </View>
      <BellButton item={item} compact />
    </Press>
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
            QEII gym right now
          </T>
          <Row gap={8} style={{ marginTop: 2 }}>
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: tone }} />
            <T v="heading">{open ? label : 'Closed'}</T>
          </Row>
        </View>
        <Badge label={open ? `Open until ${today.close}` : `Opens ${today.open}`} tone={open ? 'green' : 'neutral'} />
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
  tile: { height: 190, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.ink, ...shadow },
  tileArrow: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  quick: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow },
  quickIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' },
  upRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, marginBottom: space.md, ...shadow },
  upIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' },
  arrow: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
});
