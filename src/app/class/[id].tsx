import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntryCode } from '@/components/brand';
import { PaySheet } from '@/components/pay-sheet';
import { BackButton, Badge, Button, Card, Divider, IconTile, IconName, Row, Sheet, T, tap } from '@/components/ui';
import { categoryOf, sessionById } from '@/data';
import { dateLong, endTime, money, time } from '@/format';
import { useStore } from '@/store';
import { colors, radius, space } from '@/theme';

export default function ClassDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [now] = useState(Date.now);

  const session = sessionById(id);
  if (!session) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <T v="heading">Session not found</T>
        <Button title="Back to timetable" kind="ghost" onPress={() => router.replace('/book')} style={{ marginTop: space.lg }} />
      </View>
    );
  }

  const cat = categoryOf(session.category);
  const booking = store.isBooked(session.id);
  const left = store.spacesLeft(session);
  const full = left === 0 && !booking;
  const included = !!store.membership;
  const filled = (session.capacity - left) / session.capacity;
  const finished = new Date(session.start).getTime() < now;

  const book = () => {
    if (included) {
      setBusy(true);
      setTimeout(() => {
        store.book(session, 'membership');
        tap('success');
        setBusy(false);
        setSuccess(true);
      }, 600);
    } else {
      setPaying(true);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}>
        <View style={{ height: 320 }}>
          <Image source={cat.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={['rgba(11,11,12,0.35)', 'transparent', 'rgba(11,11,12,0.9)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={{ position: 'absolute', top: insets.top + space.sm, left: space.xl }}>
            <BackButton dark />
          </View>
          <Animated.View entering={FadeInUp.duration(500)} style={{ position: 'absolute', left: space.xl, right: space.xl, bottom: space.xl }}>
            <Badge label={cat.label} tone="dark" icon={cat.icon as IconName} />
            <T v="hero" color={colors.white} style={{ marginTop: space.sm }}>
              {session.title}
            </T>
            <T v="body" color="rgba(255,255,255,0.8)">
              {dateLong(session.start)} · {time(session.start)}–{endTime(session.start, session.minutes)}
            </T>
          </Animated.View>
        </View>

        <View style={{ padding: space.xl, marginTop: -space.sm }}>
          <Card style={{ paddingVertical: space.sm }}>
            <InfoRow icon="location" label="Where" value={session.location} />
            <Divider inset={66} />
            {session.instructor && (
              <>
                <InfoRow icon="person" label="Instructor" value={session.instructor} />
                <Divider inset={66} />
              </>
            )}
            <InfoRow icon="flame" label="Intensity" value={['Easy going', 'Moderate', 'High energy'][session.intensity - 1]} right={<Dots n={session.intensity} />} />
            <Divider inset={66} />
            <InfoRow icon="time" label="Duration" value={`${session.minutes} minutes`} />
          </Card>

          <Card style={{ padding: space.lg, marginTop: space.lg }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="bodyBold">{full ? 'Fully booked' : `${left} of ${session.capacity} spaces left`}</T>
              <T v="smallBold" color={colors.textMuted}>
                {Math.round(filled * 100)}% full
              </T>
            </Row>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.bg, marginTop: space.md, overflow: 'hidden' }}>
              <View style={{ width: `${filled * 100}%`, height: '100%', borderRadius: 4, backgroundColor: filled > 0.85 ? colors.red : colors.ink }} />
            </View>
          </Card>

          <T v="heading" style={{ marginTop: space.xxl }}>
            About this session
          </T>
          <T v="body" color={colors.textMuted} style={{ marginTop: space.sm }}>
            {session.blurb}
          </T>
          <T v="small" color={colors.textMuted} style={{ marginTop: space.lg }}>
            Free cancellation up to 2 hours before. Arrive 5 minutes early and scan your entry code at the gate.
          </T>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        {booking ? (
          <Row gap={space.md}>
            <Button title="Cancel" kind="ghost" onPress={() => setConfirmCancel(true)} style={{ flex: 1 }} />
            <Button title="Entry code" kind="dark" icon="qr-code" onPress={() => setShowCode(true)} style={{ flex: 2 }} />
          </Row>
        ) : (
          <Row gap={space.lg}>
            <View style={{ flex: 1 }}>
              <T v="caption" color={colors.textMuted}>
                {included ? 'With membership' : 'Pay as you go'}
              </T>
              <T v="title">{included ? 'Free' : money(session.price)}</T>
            </View>
            {finished ? (
              <Button title="Session finished" kind="ghost" disabled style={{ flex: 1.4 }} />
            ) : full ? (
              <Button
                title={waitlisted ? 'On waitlist' : 'Join waitlist'}
                kind="dark"
                icon={waitlisted ? 'checkmark' : 'notifications'}
                disabled={waitlisted}
                onPress={() => {
                  tap('success');
                  setWaitlisted(true);
                }}
                style={{ flex: 1.4 }}
              />
            ) : (
              <Button title="Book now" onPress={book} loading={busy} style={{ flex: 1.4 }} />
            )}
          </Row>
        )}
      </View>

      <PaySheet
        visible={paying}
        onClose={() => setPaying(false)}
        title={session.title}
        subtitle={`${dateLong(session.start)} · ${time(session.start)}`}
        amount={session.price}
        onPaid={(method) => {
          store.book(session, method);
          setPaying(false);
          setTimeout(() => setSuccess(true), 250);
        }}
      />

      <Sheet visible={success} onClose={() => setSuccess(false)}>
        <View style={{ alignItems: 'center' }}>
          <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.tick}>
            <Ionicons name="checkmark" size={44} color={colors.white} />
          </Animated.View>
          <T v="title" style={{ marginTop: space.lg }}>
            You&apos;re booked in
          </T>
          <T v="body" color={colors.textMuted} center style={{ marginTop: 4 }}>
            {session.title} · {dateLong(session.start)} at {time(session.start)}
          </T>
          <T v="small" color={colors.textMuted} center style={{ marginTop: space.sm }}>
            We&apos;ll remind you an hour before.
          </T>
        </View>
        <Button title="View my bookings" kind="dark" onPress={() => { setSuccess(false); router.navigate('/bookings'); }} style={{ marginTop: space.xxl }} />
        <Button title="Done" kind="ghost" onPress={() => setSuccess(false)} style={{ marginTop: space.md }} />
      </Sheet>

      <Sheet visible={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <T v="title">Cancel this booking?</T>
        <T v="body" color={colors.textMuted} style={{ marginTop: space.sm }}>
          {session.title}, {dateLong(session.start)} at {time(session.start)}.
          {booking && booking.paid > 0 ? ` Your ${money(booking.paid)} goes straight back to your card.` : ' Your space goes to the next person on the waitlist.'}
        </T>
        <Button
          title="Yes, cancel booking"
          kind="danger"
          onPress={() => {
            if (booking) store.cancel(booking.id);
            tap('medium');
            setConfirmCancel(false);
          }}
          style={{ marginTop: space.xxl }}
        />
        <Button title="Keep it" kind="ghost" onPress={() => setConfirmCancel(false)} style={{ marginTop: space.md }} />
      </Sheet>

      <Sheet visible={showCode} onClose={() => setShowCode(false)}>
        <View style={{ alignItems: 'center' }}>
          <T v="title">Scan at the gate</T>
          <T v="small" color={colors.textMuted} style={{ marginTop: 4 }}>
            {session.title} · {time(session.start)}
          </T>
          <View style={{ padding: space.xl, borderRadius: radius.lg, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, marginTop: space.xl }}>
            <EntryCode value={booking?.id ?? session.id} size={190} />
          </View>
          <T v="caption" color={colors.textMuted} style={{ marginTop: space.md, letterSpacing: 2 }}>
            {(booking?.id ?? '').toUpperCase()}
          </T>
        </View>
        <Button title="Done" kind="dark" onPress={() => setShowCode(false)} style={{ marginTop: space.xl }} />
      </Sheet>
    </View>
  );
}

function InfoRow({ icon, label, value, right }: { icon: IconName; label: string; value: string; right?: React.ReactNode }) {
  return (
    <Row gap={space.md} style={{ paddingVertical: 12, paddingHorizontal: space.lg }}>
      <IconTile name={icon} size={36} />
      <View style={{ flex: 1 }}>
        <T v="caption" color={colors.textMuted}>
          {label}
        </T>
        <T v="bodyBold">{value}</T>
      </View>
      {right}
    </Row>
  );
}

function Dots({ n }: { n: number }) {
  return (
    <Row gap={4}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ width: 18, height: 6, borderRadius: 3, backgroundColor: i <= n ? colors.red : colors.line }} />
      ))}
    </Row>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  tick: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
});
