import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconName, Press, T } from '@/components/ui';
import { colors } from '@/theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TABS: Record<string, { label: string; icon: IconName; iconOn: IconName }> = {
  index: { label: 'Home', icon: 'home-outline', iconOn: 'home' },
  book: { label: 'Book', icon: 'calendar-outline', iconOn: 'calendar' },
  bookings: { label: 'Bookings', icon: 'ticket-outline', iconOn: 'ticket' },
  membership: { label: 'Membership', icon: 'card-outline', iconOn: 'card' },
};

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="book" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="membership" />
    </Tabs>
  );
}

function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom - 6, 12) }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(20px)' } as object]} />
        ) : (
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        )}
        {state.routes.map((route, i) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const on = state.index === i;
          return (
            <Press
              key={route.key}
              onPress={() => {
                if (!on) navigateToTab(route.key);
              }}
              scaleTo={0.9}
              style={styles.item}>
              <View style={[styles.iconPill, on && { backgroundColor: colors.redSoft }]}>
                <Ionicons name={on ? meta.iconOn : meta.icon} size={21} color={on ? colors.red : colors.textMuted} />
              </View>
              <T v="caption" color={on ? colors.ink : colors.textMuted} style={{ fontSize: 10.5, marginTop: 2 }} numberOfLines={1}>
                {meta.label}
              </T>
            </Press>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 440,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    ...Platform.select({
      web: { boxShadow: '0 10px 30px rgba(11,11,12,0.12)' },
      default: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
    }),
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconPill: { width: 46, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
