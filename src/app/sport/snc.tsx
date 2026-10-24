import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventRow } from '@/components/event-row';
import { MembershipCheck } from '@/components/membership-check';
import { BackButton, Badge, Card, Row, T } from '@/components/ui';
import { SNC_PLANS, sncEvents } from '@/sport';
import { useStore } from '@/store';
import { colors, space } from '@/theme';

export default function Snc() {
  const insets = useSafeAreaInsets();
  const { snc } = useStore();
  const [now] = useState(() => new Date());
  const plan = SNC_PLANS.find((p) => p.id === snc?.planId);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={{ height: 280 }}>
          <Image source={require('@/assets/photos/snc.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={['rgba(11,11,12,0.35)', 'transparent', 'rgba(11,11,12,0.92)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={{ position: 'absolute', top: insets.top + space.sm, left: space.xl }}>
            <BackButton dark />
          </View>
          <View style={{ position: 'absolute', left: space.xl, right: space.xl, bottom: space.xl }}>
            <Badge label="DMU Team" tone="dark" icon="barbell" />
            <T v="hero" color={colors.white} style={{ marginTop: space.sm }}>
              Strength &amp; Conditioning
            </T>
            <T v="body" color="rgba(255,255,255,0.8)">
              Coached sessions in the S&amp;C suite at the Watershed.
            </T>
          </View>
        </View>

        <View style={{ padding: space.xl }}>
          <MembershipCheck
            found={!!snc}
            what="S&C membership"
            pitch="Get coached strength sessions built around your season. From £30 for the year."
            cta="Get your membership"
            onJoin={() => router.push({ pathname: '/sport/join', params: { kind: 'snc' } })}>
            {plan && (
              <Card dark style={{ padding: space.xl, marginBottom: space.xxl }}>
                <T v="caption" color="rgba(255,255,255,0.6)">
                  Your plan
                </T>
                <T v="title" color={colors.white}>
                  {plan.name}
                </T>
                <T v="caption" color="rgba(255,255,255,0.5)" style={{ letterSpacing: 2, marginTop: 4 }}>
                  {snc?.number}
                </T>
              </Card>
            )}
            <T v="heading" style={{ marginBottom: space.md }}>
              Your sessions
            </T>
            {sncEvents(now).map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </MembershipCheck>

          <T v="heading" style={{ marginTop: space.xxl, marginBottom: space.md }}>
            What you get
          </T>
          {SNC_PLANS.map((p) => (
            <Card key={p.id} style={{ padding: space.lg, marginBottom: space.md }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View>
                  <T v="bodyBold">{p.name}</T>
                  <T v="caption" color={colors.textMuted}>
                    {p.tagline}
                  </T>
                </View>
                <T v="heading">£{p.price}/{p.period}</T>
              </Row>
              <View style={{ marginTop: space.md, gap: 6 }}>
                {p.perks.map((perk) => (
                  <Row key={perk} gap={8}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.red} />
                    <T v="small">{perk}</T>
                  </Row>
                ))}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
