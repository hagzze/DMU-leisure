import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Lion } from '@/components/brand';
import { Button, Card, Divider, ListRow, Row, Screen, Sheet, T, Toggle, TopBar } from '@/components/ui';
import { planById, useStore } from '@/store';
import { colors, space } from '@/theme';

export default function Account() {
  const { user, card, membership, signOut, resetDemo } = useStore();
  const [faceId, setFaceId] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  if (!user) return null;

  return (
    <Screen>
      <TopBar title="Account" />
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
            {membership ? planById(membership.planId)?.name : 'Pay as you go'}
          </T>
        </Row>
      </View>

      <T v="overline" color={colors.textMuted} style={{ marginBottom: space.sm, marginLeft: 4 }}>
        Wallet
      </T>
      <Card>
        <ListRow icon="logo-apple" title="Apple Pay" subtitle="Default for one-tap booking" right={<T v="smallBold" color={colors.green}>On</T>} />
        <Divider inset={66} />
        <ListRow icon="card-outline" title={card ? `${card.brand} •••• ${card.last4}` : 'Add a card'} subtitle={card ? `Expires ${card.expiry}` : 'Saved securely for next time'} onPress={() => router.push('/card')} />
      </Card>

      <T v="overline" color={colors.textMuted} style={{ marginTop: space.xl, marginBottom: space.sm, marginLeft: 4 }}>
        Settings
      </T>
      <Card>
        <ListRow icon="scan-outline" title="Sign in with Face ID" right={<Toggle value={faceId} onChange={setFaceId} />} />
        <Divider inset={66} />
        <ListRow icon="notifications-outline" title="Class reminders" subtitle="An hour before you're due" right={<Toggle value={reminders} onChange={setReminders} />} />
        <Divider inset={66} />
        <ListRow icon="information-circle-outline" title="Centre info and opening hours" onPress={() => router.push('/centre')} />
      </Card>

      <Card style={{ marginTop: space.xl }}>
        <ListRow icon="log-out-outline" title="Sign out" tone="red" onPress={signOut} />
        <Divider inset={66} />
        <ListRow icon="refresh-outline" title="Reset demo" subtitle="Clears bookings, membership and login" onPress={() => setConfirmReset(true)} />
      </Card>

      <T v="caption" color={colors.textFaint} center style={{ marginTop: space.xl }}>
        DMU Leisure · prototype v0.1
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
