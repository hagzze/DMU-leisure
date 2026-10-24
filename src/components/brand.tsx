import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { T } from '@/components/ui';
import { planById, Membership, User } from '@/store';
import { colors, radius, space } from '@/theme';

const LION = { red: require('@/assets/images/lion-mark.png'), white: require('@/assets/images/lion-mark-white.png') };

export function Lion({ size = 28, color = 'red' }: { size?: number; color?: keyof typeof LION }) {
  return <Image source={LION[color]} style={{ width: size, height: size }} contentFit="contain" />;
}

// Deterministic QR-style grid, so the entry code looks real but encodes nothing.
export function EntryCode({ value, size = 132, color = colors.ink }: { value: string; size?: number; color?: string }) {
  const n = 21;
  const cell = size / n;
  let h = 7;
  const bits: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h = (h * 31 + value.charCodeAt(i % value.length) + i) % 1000003;
    bits.push(h % 7 < 3);
  }
  const finder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    for (const [r0, c0] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
      if (inBox(r0, c0)) {
        const rr = r - r0, cc = c - c0;
        const ring = rr === 0 || rr === 6 || cc === 0 || cc === 6;
        const core = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
        return ring || core ? 1 : 0;
      }
    }
    return -1;
  };
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap' }}>
      {Array.from({ length: n * n }, (_, i) => {
        const r = Math.floor(i / n), c = i % n;
        const f = finder(r, c);
        const on = f === -1 ? bits[i] : f === 1;
        return <View key={i} style={{ width: cell, height: cell, backgroundColor: on ? color : 'transparent' }} />;
      })}
    </View>
  );
}

export function MemberCard({ user, membership, compact }: { user: User; membership: Membership; compact?: boolean }) {
  const plan = planById(membership.planId);
  return (
    <LinearGradient
      colors={[colors.ink3, colors.ink, '#140508']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: radius.xl, padding: space.xl, overflow: 'hidden', aspectRatio: compact ? 1.7 : undefined }}>
      <View style={{ position: 'absolute', right: -40, bottom: -50, opacity: 0.16 }}>
        <Lion size={230} color="red" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Lion size={26} color="white" />
          <T v="overline" color={colors.white}>
            DMU Leisure
          </T>
        </View>
        <View style={{ backgroundColor: colors.red, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill }}>
          <T v="caption" color={colors.white}>
            Active
          </T>
        </View>
      </View>
      <View style={{ marginTop: compact ? 'auto' : space.xxxl }}>
        <T v="small" color="rgba(255,255,255,0.6)">
          {plan?.name}
        </T>
        <T v="title" color={colors.white}>
          {user.firstName} {user.lastName}
        </T>
        <T v="caption" color="rgba(255,255,255,0.5)" style={{ marginTop: 4, letterSpacing: 2 }}>
          {membership.number}
        </T>
      </View>
    </LinearGradient>
  );
}
