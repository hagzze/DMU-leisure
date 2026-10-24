import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Badge, Press, Row, T } from '@/components/ui';
import { categoryOf, Session } from '@/data';
import { time } from '@/format';
import { useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

export function SpacesBadge({ session, past }: { session: Session; past?: boolean }) {
  const { spacesLeft, isBooked } = useStore();
  if (isBooked(session.id)) return <Badge label="Booked" tone="green" icon="checkmark-circle" />;
  if (past) return <Badge label="Finished" tone="neutral" />;
  const left = spacesLeft(session);
  if (left === 0) return <Badge label="Full · join waitlist" tone="neutral" />;
  if (left <= 5) return <Badge label={`${left} left`} tone="amber" />;
  return <Badge label={`${left} spaces`} tone="neutral" />;
}

export function SessionRow({ session }: { session: Session }) {
  const cat = categoryOf(session.category);
  const [now] = useState(Date.now);
  const past = new Date(session.start).getTime() < now;
  return (
    <Press
      onPress={() => router.push({ pathname: '/class/[id]', params: { id: session.id } })}
      scaleTo={0.98}
      style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, marginBottom: space.md, opacity: past ? 0.5 : 1, ...shadow }}>
      <Row gap={space.lg} style={{ alignItems: 'flex-start' }}>
        <View style={{ width: 58 }}>
          <T v="heading">{time(session.start)}</T>
          <T v="caption" color={colors.textMuted}>
            {session.minutes} min
          </T>
        </View>
        <View style={{ flex: 1 }}>
          <T v="bodyBold">{session.title}</T>
          <Row gap={6} style={{ marginTop: 2 }}>
            <Ionicons name={cat.icon as never} size={13} color={colors.textMuted} />
            <T v="small" color={colors.textMuted} numberOfLines={1} style={{ flexShrink: 1 }}>
              {session.location}
              {session.instructor ? ` · ${session.instructor}` : ''}
            </T>
          </Row>
          <View style={{ marginTop: space.sm }}>
            <SpacesBadge session={session} past={past} />
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} style={{ alignSelf: 'center' }} />
      </Row>
    </Press>
  );
}
