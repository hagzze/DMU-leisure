import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Lion } from '@/components/brand';
import { MembershipCheck } from '@/components/membership-check';
import { Badge, Button, Card, Press, Row, Screen, SectionTitle, T, TopBar } from '@/components/ui';
import { dayShort } from '@/format';
import { CLUBS, clubById } from '@/sport';
import { useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

export default function Team() {
  const { clubs } = useStore();
  const joinNew = () => router.push({ pathname: '/sport/join', params: { kind: 'team' } });

  return (
    <Screen>
      <TopBar />
      <T v="overline" color={colors.red}>
        DMU Team
      </T>
      <T v="hero" style={{ marginTop: 2 }}>
        Sports clubs
      </T>
      <T v="body" color={colors.textMuted} style={{ marginTop: space.sm, marginBottom: space.xl }}>
        Train, compete and represent DMU. Club membership is £40 or £60 for the year.
      </T>

      <MembershipCheck
        found={clubs.length > 0}
        what="team membership"
        pitch="You need a DMU Team membership to train and play. It takes about a minute."
        cta="Get your membership"
        onJoin={joinNew}>
        {clubs.map((m) => {
          const club = clubById(m.clubId)!;
          return (
            <Press key={m.clubId} onPress={() => router.push({ pathname: '/sport/club/[id]', params: { id: m.clubId } })} scaleTo={0.98} style={{ marginBottom: space.md }}>
              <View style={{ backgroundColor: colors.ink, borderRadius: radius.xl, padding: space.xl, overflow: 'hidden' }}>
                <View style={{ position: 'absolute', right: -24, bottom: -30, opacity: 0.25 }}>
                  <Lion size={150} />
                </View>
                <Row style={{ justifyContent: 'space-between' }}>
                  {m.trial && m.until ? (
                    <Badge label={`Free trial · ends ${dayShort(m.until)}`} tone="amber" icon="gift" />
                  ) : (
                    <Badge label="Active" tone="green" icon="checkmark-circle" />
                  )}
                  <Ionicons name={club.icon as never} size={22} color={colors.white} />
                </Row>
                <T v="title" color={colors.white} style={{ marginTop: space.lg }}>
                  {club.name}
                </T>
                <T v="body" color="rgba(255,255,255,0.7)">
                  {m.team}
                </T>
                <Row style={{ justifyContent: 'space-between', marginTop: space.lg }}>
                  <T v="caption" color="rgba(255,255,255,0.5)" style={{ letterSpacing: 2 }}>
                    {m.number}
                  </T>
                  <T v="smallBold" color={colors.white}>
                    Training and fixtures →
                  </T>
                </Row>
              </View>
            </Press>
          );
        })}
        <Button title="Join another team" kind="ghost" icon="add" onPress={joinNew} />
      </MembershipCheck>

      <SectionTitle title="All clubs" />
      {CLUBS.map((c) => {
        const mine = clubs.some((m) => m.clubId === c.id);
        return (
          <Press key={c.id} onPress={() => router.push({ pathname: '/sport/club/[id]', params: { id: c.id } })} scaleTo={0.98} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, marginBottom: space.sm, ...shadow }}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: mine ? colors.red : colors.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={c.icon as never} size={20} color={mine ? colors.white : colors.ink} />
            </View>
            <View style={{ flex: 1 }}>
              <T v="bodyBold">{c.name}</T>
              <T v="caption" color={colors.textMuted}>
                {c.teams.length} team{c.teams.length === 1 ? '' : 's'} · £{c.fee}/year{c.bucs ? ' · BUCS' : ''}
              </T>
            </View>
            {mine ? <Badge label="Member" tone="green" /> : <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />}
          </Press>
        );
      })}
      <Card style={{ padding: space.lg, marginTop: space.md }}>
        <T v="small" color={colors.textMuted} center>
          Can&apos;t see your sport? DMU has 29 activities. Ask at the Watershed.
        </T>
      </Card>

      {clubs.length === 0 && (
        <Card dark style={{ padding: space.xl, marginTop: space.xxl }}>
          <Row gap={space.md} style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="gift" size={22} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <T v="heading" color={colors.white}>
                Want to try the club out before committing?
              </T>
              <T v="body" color="rgba(255,255,255,0.7)" style={{ marginTop: 4 }}>
                Have two free sessions on us. A two-week sport membership, free of charge.
              </T>
            </View>
          </Row>
          <Button title="Start my free trial" icon="arrow-forward" kind="light" onPress={() => router.push({ pathname: '/sport/join', params: { kind: 'team', trial: '1' } })} style={{ marginTop: space.xl }} />
        </Card>
      )}
    </Screen>
  );
}
