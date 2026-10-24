import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Lion } from '@/components/brand';
import { Badge, Press, Row, T } from '@/components/ui';
import { dayShort } from '@/format';
import { clubById } from '@/sport';
import type { ClubMembership } from '@/store';
import { colors, radius, space } from '@/theme';

const PASS_HEIGHT = 170;
// How much of each pass behind the front one stays visible, like a wallet.
const PEEK = 64;

function TeamPass({ m, front }: { m: ClubMembership; front: boolean }) {
  const club = clubById(m.clubId);
  return (
    <View style={{ height: PASS_HEIGHT, borderRadius: radius.xl, padding: space.xl, overflow: 'hidden', backgroundColor: front ? colors.ink : colors.ink3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
      <View style={{ position: 'absolute', right: -30, bottom: -46, opacity: 0.22 }}>
        <Lion size={190} />
      </View>
      {/* Club and team sit at the top so they still show when this pass is tucked behind another. */}
      <Row style={{ justifyContent: 'space-between' }}>
        <Row gap={10} style={{ flexShrink: 1 }}>
          <Lion size={22} color="white" />
          <T v="heading" color={colors.white} numberOfLines={1} style={{ flexShrink: 1 }}>
            {club?.name}
          </T>
        </Row>
        <T v="smallBold" color="rgba(255,255,255,0.75)">
          {m.team}
        </T>
      </Row>
      <View style={{ flex: 1 }} />
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <T v="overline" color={colors.white}>
            {m.trial ? 'Free 2-week trial' : 'DMU Team membership'}
          </T>
          <T v="caption" color="rgba(255,255,255,0.5)" style={{ letterSpacing: 2, marginTop: 4 }}>
            {m.number}
          </T>
        </View>
        {m.trial && m.until ? <Badge label={`Ends ${dayShort(m.until)}`} tone="amber" /> : null}
      </Row>
    </View>
  );
}

// The member's team passes, stacked like Apple Wallet. Tapping one opens that club to book training and transport.
export function TeamPassStack({ clubs }: { clubs: ClubMembership[] }) {
  const height = PASS_HEIGHT + (clubs.length - 1) * PEEK;
  return (
    <View style={{ height }}>
      {clubs.map((m, i) => (
        <Animated.View key={m.clubId} entering={FadeInDown.delay(i * 70).duration(400)} style={{ position: 'absolute', left: 0, right: 0, top: i * PEEK, borderRadius: radius.xl, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: -4 } }}>
          <Press onPress={() => router.push({ pathname: '/sport/club/[id]', params: { id: m.clubId } })} scaleTo={0.98} accessibilityLabel={`${clubById(m.clubId)?.name} ${m.team}: book training and transport`}>
            <TeamPass m={m} front={i === clubs.length - 1} />
          </Press>
        </Animated.View>
      ))}
    </View>
  );
}
