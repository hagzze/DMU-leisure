import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Lion } from '@/components/brand';
import { Badge, Button, Card, Divider, ListRow, Row, Screen, Sheet, T, Toggle } from '@/components/ui';
import { SNC_PLANS, clubById, societyById } from '@/sport';
import { planById, upcomingBookings, useStore } from '@/store';
import { colors, space } from '@/theme';

export default function Account() {
  const { user, card, membership, clubs, snc, societies, bookings, activities, signOut, resetDemo } = useStore();
  const [faceId, setFaceId] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  if (!user) return null;

  const memberships = (membership ? 1 : 0) + clubs.length + (snc ? 1 : 0) + societies.length;
  const upcoming = upcomingBookings(bookings).length + activities.length;

  return (
    <Screen tabs>
      <View style={{ alignItems: 'center', marginBottom: space.xl }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
          <T v="title" color={colors.white}>
            {user.firstName[0]}
            {user.lastName[0]}
          </T>
        </View>
        <T v="title" style={{ marginTop: space.md }}>
          {user.firstName} {user.lastName}
        </T>
        <T v="small" color={colors.textMuted}>
          {user.email}
        </T>
        <Row gap={6} style={{ marginTop: space.sm }}>
          <Lion size={16} />
          <T v="smallBold" color={colors.red}>
            {memberships ? `${memberships} active membership${memberships === 1 ? '' : 's'}` : 'No memberships yet'}
          </T>
        </Row>
      </View>

      <Label text="Memberships" />
      <Card>
        <ListRow
          icon="card-outline"
          title="QEII Leisure"
          subtitle={membership ? planById(membership.planId)?.name : 'Pay as you go'}
          right={membership ? <Badge label="Active" tone="green" /> : <Badge label="Join" tone="red" />}
          onPress={() => router.push('/membership')}
        />
        <Divider inset={66} />
        {clubs.length ? (
          clubs.map((c) => (
            <View key={c.clubId}>
              <ListRow
                icon={(clubById(c.clubId)?.icon ?? 'people') as never}
                title={`DMU Team · ${clubById(c.clubId)?.name}`}
                subtitle={c.team}
                right={<Badge label="Active" tone="green" />}
                onPress={() => router.push({ pathname: '/sport/club/[id]', params: { id: c.clubId } })}
              />
              <Divider inset={66} />
            </View>
          ))
        ) : (
          <>
            <ListRow icon="trophy-outline" title="DMU Team" subtitle="No team membership" right={<Badge label="Join" tone="red" />} onPress={() => router.push('/sport/team')} />
            <Divider inset={66} />
          </>
        )}
        <ListRow
          icon="barbell-outline"
          title="Strength & Conditioning"
          subtitle={snc ? SNC_PLANS.find((p) => p.id === snc.planId)?.name : 'No S&C membership'}
          right={snc ? <Badge label="Active" tone="green" /> : <Badge label="Join" tone="red" />}
          onPress={() => router.push('/sport/snc')}
        />
        <Divider inset={66} />
        <ListRow
          icon="people-outline"
          title="Societies"
          subtitle={societies.length ? societies.map((s) => societyById(s.societyId)?.name).join(', ') : 'No society memberships'}
          right={societies.length ? <Badge label={String(societies.length)} tone="green" /> : <Badge label="Join" tone="red" />}
          onPress={() => router.push('/sport/societies')}
        />
      </Card>

      <Label text="Bookings" />
      <Card>
        <ListRow icon="ticket-outline" title="Manage bookings" subtitle={upcoming ? `${upcoming} coming up` : 'Nothing booked'} onPress={() => router.push('/bookings')} />
      </Card>

      <Label text="Wallet" />
      <Card>
        <ListRow icon="logo-apple" title="Apple Pay" subtitle="Default for one-tap booking" right={<T v="smallBold" color={colors.green}>On</T>} />
        <Divider inset={66} />
        <ListRow icon="card-outline" title={card ? `${card.brand} •••• ${card.last4}` : 'Add a card'} subtitle={card ? `Expires ${card.expiry}` : 'Saved securely for next time'} onPress={() => router.push('/card')} />
      </Card>

      <Label text="Settings" />
      <Card>
        <ListRow icon="scan-outline" title="Sign in with Face ID" right={<Toggle value={faceId} onChange={setFaceId} />} />
        <Divider inset={66} />
        <ListRow icon="notifications-outline" title="Training reminders" subtitle="An hour before you're due" right={<Toggle value={reminders} onChange={setReminders} />} />
        <Divider inset={66} />
        <ListRow icon="information-circle-outline" title="Centre info and opening hours" onPress={() => router.push('/centre')} />
      </Card>

      <Card style={{ marginTop: space.xl }}>
        <ListRow icon="log-out-outline" title="Sign out" tone="red" onPress={signOut} />
        <Divider inset={66} />
        <ListRow icon="refresh-outline" title="Reset demo" subtitle="Clears bookings, memberships and login" onPress={() => setConfirmReset(true)} />
      </Card>

      <T v="caption" color={colors.textFaint} center style={{ marginTop: space.xl }}>
        DMU Leisure · prototype v0.2
      </T>

      <Sheet visible={confirmReset} onClose={() => setConfirmReset(false)}>
        <T v="title">Reset the demo?</T>
        <T v="body" color={colors.textMuted} style={{ marginTop: space.sm }}>
          This wipes everything and takes you back to the sign-in screen, ready for a fresh walkthrough.
        </T>
        <Button title="Reset everything" kind="danger" onPress={resetDemo} style={{ marginTop: space.xxl }} />
        <Button title="Cancel" kind="ghost" onPress={() => setConfirmReset(false)} style={{ marginTop: space.md }} />
      </Sheet>
    </Screen>
  );
}

function Label({ text }: { text: string }) {
  return (
    <T v="overline" color={colors.textMuted} style={{ marginTop: space.xl, marginBottom: space.sm, marginLeft: 4 }}>
      {text}
    </T>
  );
}
