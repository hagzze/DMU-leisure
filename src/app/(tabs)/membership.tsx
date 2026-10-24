import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EntryCode, MemberCard } from '@/components/brand';
import { PlanCard } from '@/components/plan-card';
import { Button, Card, Divider, ListRow, Press, Row, Screen, Sheet, T } from '@/components/ui';
import { PLANS } from '@/data';
import { dateLong } from '@/format';
import { planById, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

export default function MembershipTab() {
  const { user, membership, leaveMembership } = useStore();
  const [selected, setSelected] = useState(PLANS[0].id);
  const [code, setCode] = useState(false);
  const [leave, setLeave] = useState(false);

  if (membership && user) {
    const plan = planById(membership.planId)!;
    const renews = new Date(membership.since);
    renews.setMonth(renews.getMonth() + (plan.period === 'year' ? 12 : 1));
    return (
      <Screen tabs>
        <T v="overline" color={colors.red}>
          Membership
        </T>
        <T v="hero" style={{ marginTop: 2, marginBottom: space.xl }}>
          Your card
        </T>
        <Animated.View entering={FadeInDown.duration(500)}>
          <Press onPress={() => setCode(true)} scaleTo={0.98}>
            <MemberCard user={user} membership={membership} />
          </Press>
        </Animated.View>
        <Button title="Show entry code" icon="qr-code" kind="dark" onPress={() => setCode(true)} style={{ marginTop: space.lg }} />

        <Card style={{ marginTop: space.xxl }}>
          <ListRow icon="ribbon-outline" title={plan.name} subtitle={`£${plan.price} per ${plan.period}`} />
          <Divider inset={66} />
          <ListRow icon="calendar-outline" title="Renews" subtitle={dateLong(renews)} />
          <Divider inset={66} />
          <ListRow icon="card-outline" title="Payment" subtitle="Apple Pay" onPress={() => router.push('/card')} />
        </Card>

        <T v="heading" style={{ marginTop: space.xxl, marginBottom: space.md }}>
          What&apos;s included
        </T>
        <Card style={{ padding: space.lg, gap: 12 }}>
          {plan.perks.map((p) => (
            <Row key={p} gap={10}>
              <Ionicons name="checkmark-circle" size={20} color={colors.red} />
              <T v="body">{p}</T>
            </Row>
          ))}
        </Card>

        <Card style={{ marginTop: space.lg }}>
          <ListRow icon="pause-circle-outline" title="Pause membership" subtitle="Going home for the holidays?" onPress={() => {}} />
          <Divider inset={66} />
          <ListRow icon="close-circle-outline" title="Cancel membership" tone="red" onPress={() => setLeave(true)} />
        </Card>

        <Sheet visible={code} onClose={() => setCode(false)}>
          <View style={{ alignItems: 'center' }}>
            <T v="title">Scan to enter</T>
            <T v="small" color={colors.textMuted} style={{ marginTop: 4 }}>
              Hold your phone up to the gate reader
            </T>
            <View style={{ padding: space.xl, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, marginTop: space.xl }}>
              <EntryCode value={membership.number} size={200} />
            </View>
            <T v="caption" color={colors.textMuted} style={{ marginTop: space.md, letterSpacing: 2 }}>
              {membership.number}
            </T>
          </View>
          <Button title="Done" kind="dark" onPress={() => setCode(false)} style={{ marginTop: space.xl }} />
        </Sheet>

        <Sheet visible={leave} onClose={() => setLeave(false)}>
          <T v="title">Cancel your membership?</T>
          <T v="body" color={colors.textMuted} style={{ marginTop: space.sm }}>
            You&apos;ll keep access until {dateLong(renews)}. You can rejoin any time in one tap.
          </T>
          <Button
            title="Cancel membership"
            kind="danger"
            onPress={() => {
              leaveMembership();
              setLeave(false);
            }}
            style={{ marginTop: space.xxl }}
          />
          <Button title="Keep my membership" kind="ghost" onPress={() => setLeave(false)} style={{ marginTop: space.md }} />
        </Sheet>
      </Screen>
    );
  }

  return (
    <Screen tabs>
      <T v="overline" color={colors.red}>
        Membership
      </T>
      <T v="hero" style={{ marginTop: 2 }}>
        Pick your plan
      </T>
      <T v="body" color={colors.textMuted} style={{ marginTop: space.sm, marginBottom: space.xl }}>
        Student prices. No joining fee. Cancel whenever you like.
      </T>
      {PLANS.map((p, i) => (
        <Animated.View key={p.id} entering={FadeInDown.delay(i * 70).duration(450)}>
          <PlanCard plan={p} selected={selected === p.id} onPress={() => setSelected(p.id)} />
        </Animated.View>
      ))}
      <Button title="Continue" icon="arrow-forward" onPress={() => router.push({ pathname: '/join', params: { plan: selected } })} style={{ marginTop: space.md }} />
      <T v="small" color={colors.textMuted} center style={{ marginTop: space.lg }}>
        Rather not commit? Pay as you go from £3.50 a session.
      </T>
    </Screen>
  );
}
