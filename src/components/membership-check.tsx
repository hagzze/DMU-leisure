import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button, Card, Row, T } from '@/components/ui';
import { colors, radius, space } from '@/theme';

// Shows a quick "checking" state, then either the member view or a clear call to join.
export function MembershipCheck({
  found,
  what,
  pitch,
  cta,
  onJoin,
  children,
}: {
  found: boolean;
  what: string;
  pitch: string;
  cta: string;
  onJoin: () => void;
  children?: ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setChecking(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (checking) {
    return (
      <Card style={{ padding: space.xl, alignItems: 'center' }}>
        <ActivityIndicator color={colors.red} />
        <T v="smallBold" color={colors.textMuted} style={{ marginTop: space.md }}>
          Checking for a {what}…
        </T>
      </Card>
    );
  }

  if (found) {
    return (
      <Animated.View entering={FadeIn.duration(300)}>
        <Row gap={8} style={{ marginBottom: space.md }}>
          <Ionicons name="checkmark-circle" size={18} color={colors.green} />
          <T v="smallBold" color={colors.green}>
            {what[0].toUpperCase() + what.slice(1)} found
          </T>
        </Row>
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <Card style={{ padding: space.xl, borderWidth: 1.5, borderColor: colors.redSoft }}>
        <Row gap={space.md}>
          <View style={{ width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="shield-outline" size={24} color={colors.red} />
          </View>
          <View style={{ flex: 1 }}>
            <T v="heading">No {what} detected</T>
            <T v="small" color={colors.textMuted}>
              {pitch}
            </T>
          </View>
        </Row>
        <Button title={cta} icon="arrow-forward" onPress={onJoin} style={{ marginTop: space.xl }} />
      </Card>
    </Animated.View>
  );
}
