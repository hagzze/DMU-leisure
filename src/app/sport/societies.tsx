import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Badge, Button, Row, Screen, T, TopBar } from '@/components/ui';
import { SOCIETIES } from '@/sport';
import { useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

export default function Societies() {
  const { societies } = useStore();
  return (
    <Screen>
      <TopBar />
      <T v="overline" color={colors.red}>
        Societies
      </T>
      <T v="hero" style={{ marginTop: 2 }}>
        Find your people
      </T>
      <T v="body" color={colors.textMuted} style={{ marginTop: space.sm, marginBottom: space.xl }}>
        {societies.length
          ? `You're in ${societies.length} societ${societies.length === 1 ? 'y' : 'ies'}. Join as many as you like.`
          : 'No society memberships yet. Pick one below and join in under a minute.'}
      </T>
      {SOCIETIES.map((s) => {
        const mine = societies.some((m) => m.societyId === s.id);
        return (
          <Row key={s.id} gap={space.md} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, marginBottom: space.sm, ...shadow }}>
            <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: mine ? colors.red : colors.ink, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={s.icon as never} size={22} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <T v="bodyBold">{s.name}</T>
              <T v="caption" color={colors.textMuted}>
                {s.blurb}
              </T>
              <T v="caption" color={colors.textFaint} style={{ marginTop: 2 }}>
                {s.members + (mine ? 1 : 0)} members · £{s.fee}/year
              </T>
            </View>
            {mine ? <Badge label="Member" tone="green" icon="checkmark-circle" /> : <Button title="Join" size="sm" onPress={() => router.push({ pathname: '/sport/join', params: { kind: 'society', id: s.id } })} />}
          </Row>
        );
      })}
    </Screen>
  );
}
