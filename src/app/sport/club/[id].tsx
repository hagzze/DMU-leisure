import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventRow } from '@/components/event-row';
import { MembershipCheck } from '@/components/membership-check';
import { useReminders } from '@/components/reminders';
import { useToast } from '@/components/toast';
import { dayLabel, time } from '@/format';
import { BackButton, Badge, Button, Card, Divider, Row, Sheet, T } from '@/components/ui';
import { clubById, DAY_NAMES, teamEvents } from '@/sport';
import { useStore } from '@/store';
import { colors, radius, space } from '@/theme';

export default function ClubPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { clubs, leaveClub, teamBookings, toggleTeamBooking } = useStore();
  const { sendTest } = useReminders();
  const toast = useToast();
  const [leaving, setLeaving] = useState(false);
  const [now] = useState(() => new Date());

  const club = clubById(id);
  if (!club) return null;
  const mine = clubs.find((m) => m.clubId === club.id);
  const events = mine ? teamEvents(club.id, mine.team, now) : [];
  const photo = ['rugby', 'football', 'hockey', 'american-football'].includes(club.id) ? require('@/assets/photos/leagues.jpg') : require('@/assets/photos/clubs.jpg');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={{ height: 280 }}>
          <Image source={photo} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={['rgba(11,11,12,0.35)', 'transparent', 'rgba(11,11,12,0.92)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={{ position: 'absolute', top: insets.top + space.sm, left: space.xl }}>
            <BackButton dark />
          </View>
          <View style={{ position: 'absolute', left: space.xl, right: space.xl, bottom: space.xl }}>
            <Row gap={6}>
              <Badge label="DMU Team" tone="dark" icon={club.icon as never} />
              {club.bucs && <Badge label="BUCS" tone="dark" />}
            </Row>
            <T v="hero" color={colors.white} style={{ marginTop: space.sm }}>
              {club.name}
            </T>
            <T v="body" color="rgba(255,255,255,0.8)">
              {club.blurb}
            </T>
          </View>
        </View>

        <View style={{ padding: space.xl }}>
          <MembershipCheck
            found={!!mine}
            what={`${club.name} membership`}
            pitch={`Join ${club.name} for £${club.fee} for the whole year. Pick your team and you're in.`}
            cta={`Get your membership · £${club.fee}`}
            onJoin={() => router.push({ pathname: '/sport/join', params: { kind: 'team', id: club.id } })}>
            {mine && (
              <>
                <Card dark style={{ padding: space.xl }}>
                  <T v="caption" color="rgba(255,255,255,0.6)">
                    {mine.trial ? 'Free trial · two sessions' : 'Your team'}
                  </T>
                  <T v="title" color={colors.white}>
                    {mine.team}
                  </T>
                  <T v="caption" color="rgba(255,255,255,0.5)" style={{ letterSpacing: 2, marginTop: 4 }}>
                    {mine.number}
                  </T>
                </Card>
                <T v="heading" style={{ marginTop: space.xxl }}>
                  Book training and transport
                </T>
                <T v="small" color={colors.textMuted} style={{ marginTop: 2, marginBottom: space.md }}>
                  One tap books your place and, for Beaumont Park, your seat on the free bus.
                </T>
                {events.map((e) => (
                  <EventRow
                    key={e.id}
                    event={e}
                    short
                    booked={teamBookings.includes(e.id)}
                    onToggleBook={() => {
                      const was = teamBookings.includes(e.id);
                      toggleTeamBooking(e.id);
                      toast(was ? { title: 'Booking cancelled', icon: 'close-circle' } : { title: e.venue === 'Beaumont Park' ? 'Training and bus booked' : 'Training booked', body: `${dayLabel(e.start)} at ${time(e.start)}` });
                    }}
                  />
                ))}
                {events[0] && (
                  <Button
                    title="Send a test notification"
                    kind="ghost"
                    icon="phone-portrait-outline"
                    onPress={() => sendTest({ id: events[0].id, title: events[0].title, start: events[0].start, location: events[0].venue })}
                    style={{ marginTop: space.sm }}
                  />
                )}
              </>
            )}
          </MembershipCheck>

          <T v="heading" style={{ marginTop: space.xxl, marginBottom: space.md }}>
            Weekly schedule
          </T>
          <Card>
            {club.training.map((t, i) => (
              <View key={`${t.day}-${t.time}`}>
                {i > 0 && <Divider inset={space.lg} />}
                <Row style={{ padding: space.lg, justifyContent: 'space-between' }}>
                  <View>
                    <T v="bodyBold">{t.label}</T>
                    <T v="caption" color={colors.textMuted}>
                      {t.venue}
                    </T>
                  </View>
                  <T v="bodyBold">
                    {DAY_NAMES[t.day]} {t.time}
                  </T>
                </Row>
              </View>
            ))}
          </Card>

          <T v="heading" style={{ marginTop: space.xxl, marginBottom: space.md }}>
            Teams
          </T>
          <Row gap={space.sm} style={{ flexWrap: 'wrap' }}>
            {club.teams.map((t) => (
              <View key={t} style={{ paddingHorizontal: 14, height: 36, borderRadius: radius.pill, justifyContent: 'center', backgroundColor: mine?.team === t ? colors.ink : colors.surface, borderWidth: 1, borderColor: mine?.team === t ? colors.ink : colors.line }}>
                <T v="smallBold" color={mine?.team === t ? colors.white : colors.ink}>
                  {t}
                </T>
              </View>
            ))}
          </Row>

          {club.training.some((t) => t.venue === 'Beaumont Park') && (
            <Row gap={10} style={{ marginTop: space.xl, backgroundColor: colors.surface, borderRadius: radius.md, padding: space.md }}>
              <Ionicons name="bus" size={18} color={colors.red} />
              <T v="small" color={colors.textMuted} style={{ flex: 1 }}>
                Free student transport to Beaumont Park is provided for training and fixtures.
              </T>
            </Row>
          )}

          {mine && <Button title="Leave club" kind="danger" onPress={() => setLeaving(true)} style={{ marginTop: space.xxl }} />}
        </View>
      </ScrollView>

      <Sheet visible={leaving} onClose={() => setLeaving(false)}>
        <T v="title">Leave {club.name}?</T>
        <T v="body" color={colors.textMuted} style={{ marginTop: space.sm }}>
          You&apos;ll lose your place in {mine?.team}. You can rejoin any time this year.
        </T>
        <Button
          title="Leave club"
          kind="danger"
          onPress={() => {
            leaveClub(club.id);
            setLeaving(false);
          }}
          style={{ marginTop: space.xxl }}
        />
        <Button title="Stay in the club" kind="ghost" onPress={() => setLeaving(false)} style={{ marginTop: space.md }} />
      </Sheet>
    </View>
  );
}
