import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaySheet } from '@/components/pay-sheet';
import { useToast } from '@/components/toast';
import { BackButton, Badge, Button, Row, T, tap } from '@/components/ui';
import { dayLabel, endTime, money, time } from '@/format';
import { programmeById, upcomingFrom } from '@/sport';
import { useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

type Slot = { id: string; title: string; start: string; minutes: number; venue: string; price: number };

export default function ProgrammePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { activities, bookActivity, cancelActivity } = useStore();
  const toast = useToast();
  const [now] = useState(() => new Date());
  const [paying, setPaying] = useState<Slot | null>(null);

  const p = programmeById(id);
  if (!p) return null;

  const slots: Slot[] = p.sessions
    .flatMap((s) =>
      upcomingFrom([{ day: s.day, time: s.time, minutes: s.minutes, venue: s.venue, label: s.title }], `${p.id}-${s.title}`, () => s.title, p.name, 'team', now).map((e) => ({
        id: e.id,
        title: s.title,
        start: e.start,
        minutes: s.minutes,
        venue: s.venue,
        price: s.price,
      })),
    )
    .sort((a, b) => a.start.localeCompare(b.start));

  const confirm = (s: Slot) => {
    bookActivity({ id: s.id, title: s.title, subtitle: p.name, start: s.start, minutes: s.minutes, location: s.venue, paid: s.price });
    tap('success');
    toast({ title: `${s.title} booked`, body: `${dayLabel(s.start)} at ${time(s.start)}` });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={{ height: 260 }}>
          <Image source={p.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={['rgba(11,11,12,0.35)', 'transparent', 'rgba(11,11,12,0.92)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={{ position: 'absolute', top: insets.top + space.sm, left: space.xl }}>
            <BackButton dark />
          </View>
          <View style={{ position: 'absolute', left: space.xl, right: space.xl, bottom: space.xl }}>
            <Badge label="DMU Sport" tone="dark" />
            <T v="hero" color={colors.white} style={{ marginTop: space.sm }}>
              {p.name}
            </T>
            <T v="body" color="rgba(255,255,255,0.8)">
              {p.tagline}
            </T>
          </View>
        </View>

        <View style={{ padding: space.xl }}>
          <T v="body" color={colors.textMuted}>
            {p.blurb} No membership needed.
          </T>
          <T v="heading" style={{ marginTop: space.xxl, marginBottom: space.md }}>
            This week
          </T>
          {slots.map((s) => {
            const booked = activities.some((a) => a.id === s.id);
            return (
              <Row key={s.id} gap={space.md} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, marginBottom: space.sm, ...shadow }}>
                <View style={{ flex: 1 }}>
                  <T v="bodyBold">{s.title}</T>
                  <T v="caption" color={colors.textMuted}>
                    {dayLabel(s.start)} · {time(s.start)}–{endTime(s.start, s.minutes)} · {s.venue}
                  </T>
                  <T v="caption" color={s.price ? colors.ink : colors.green} style={{ marginTop: 2 }}>
                    {money(s.price)}
                  </T>
                </View>
                {booked ? (
                  <Button title="Booked" kind="ghost" size="sm" icon="checkmark" onPress={() => cancelActivity(s.id)} />
                ) : (
                  <Button title="Book" size="sm" onPress={() => (s.price ? setPaying(s) : confirm(s))} />
                )}
              </Row>
            );
          })}
          <T v="caption" color={colors.textMuted} center style={{ marginTop: space.md }}>
            Tap Booked to cancel.
          </T>
        </View>
      </ScrollView>

      <PaySheet
        visible={!!paying}
        onClose={() => setPaying(null)}
        title={paying?.title ?? ''}
        subtitle={paying ? `${dayLabel(paying.start)} · ${time(paying.start)}` : undefined}
        amount={paying?.price ?? 0}
        onPaid={() => {
          if (paying) confirm(paying);
          setPaying(null);
        }}
      />
    </View>
  );
}
