import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SessionRow } from '@/components/session-row';
import { Chip, Press, Row, Screen, T } from '@/components/ui';
import { CATEGORIES, Category, SESSIONS, startOfDay } from '@/data';
import { sameDay, shortDay } from '@/format';
import { planById, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

const PARTS = [
  { label: 'Morning', from: 0, to: 12 },
  { label: 'Afternoon', from: 12, to: 17 },
  { label: 'Evening', from: 17, to: 24 },
];

export default function Qe2() {
  const { membership } = useStore();
  const params = useLocalSearchParams<{ cat?: Category }>();
  const [cat, setCat] = useState<Category | 'all'>(params.cat ?? 'all');
  const [dayIndex, setDayIndex] = useState(0);

  // Follow the category picked on Home, without an effect.
  const [lastParam, setLastParam] = useState(params.cat);
  if (params.cat !== lastParam) {
    setLastParam(params.cat);
    if (params.cat) setCat(params.cat);
  }

  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const day = days[dayIndex];
  const list = SESSIONS.filter((s) => sameDay(new Date(s.start), day) && (cat === 'all' || s.category === cat));

  return (
    <Screen tabs stickyHeaderIndices={[1]}>
      <View>
        <T v="overline" color={colors.red}>
          QEII Leisure Centre
        </T>
        <T v="hero" style={{ marginTop: 2 }}>
          Book a session
        </T>
        <Press onPress={() => router.push('/membership')} scaleTo={0.98} style={{ marginTop: space.lg, flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: membership ? colors.ink : colors.surface, borderWidth: 1, borderColor: membership ? colors.ink : colors.line }}>
          <Ionicons name={membership ? 'card' : 'card-outline'} size={20} color={membership ? colors.white : colors.red} />
          <View style={{ flex: 1 }}>
            <T v="smallBold" color={membership ? colors.white : colors.text}>
              {membership ? planById(membership.planId)?.name : 'Pay as you go'}
            </T>
            <T v="caption" color={membership ? 'rgba(255,255,255,0.6)' : colors.textMuted}>
              {membership ? 'Every session here is included' : 'Join for unlimited sessions from £15/month'}
            </T>
          </View>
          <T v="smallBold" color={membership ? colors.white : colors.red}>
            {membership ? 'Show card' : 'See plans'}
          </T>
        </Press>
      </View>

      <View style={{ backgroundColor: colors.bg, paddingTop: space.lg, paddingBottom: space.sm, marginHorizontal: -space.xl, paddingHorizontal: space.xl }}>
        <Row gap={6} style={{ justifyContent: 'space-between' }}>
          {days.map((d, i) => {
            const on = i === dayIndex;
            return (
              <Press
                key={d.toISOString()}
                onPress={() => setDayIndex(i)}
                scaleTo={0.92}
                style={{ flex: 1, height: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.red : colors.surface, borderWidth: 1, borderColor: on ? colors.red : colors.line }}>
                <T v="caption" color={on ? 'rgba(255,255,255,0.8)' : colors.textMuted}>
                  {i === 0 ? 'Today' : shortDay(d)}
                </T>
                <T v="heading" color={on ? colors.white : colors.text}>
                  {d.getDate()}
                </T>
              </Press>
            );
          })}
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.xl, marginTop: space.md }} contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.sm }}>
          <Chip label="All" active={cat === 'all'} onPress={() => setCat('all')} />
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.label} icon={c.icon as never} active={cat === c.id} onPress={() => setCat(c.id)} />
          ))}
        </ScrollView>
      </View>

      <Animated.View key={`${dayIndex}-${cat}`} entering={FadeIn.duration(250)}>
        {list.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: space.xxxl }}>
            <Ionicons name="calendar-clear-outline" size={40} color={colors.textFaint} />
            <T v="bodyBold" style={{ marginTop: space.md }}>
              Nothing on this day
            </T>
            <T v="small" color={colors.textMuted}>
              Try another day or category.
            </T>
          </View>
        )}
        {PARTS.map((p) => {
          const items = list.filter((s) => {
            const h = new Date(s.start).getHours();
            return h >= p.from && h < p.to;
          });
          if (!items.length) return null;
          return (
            <View key={p.label}>
              <T v="overline" color={colors.textMuted} style={{ marginTop: space.xl, marginBottom: space.md }}>
                {p.label}
              </T>
              {items.map((s) => (
                <SessionRow key={s.id} session={s} />
              ))}
            </View>
          );
        })}
      </Animated.View>
    </Screen>
  );
}
