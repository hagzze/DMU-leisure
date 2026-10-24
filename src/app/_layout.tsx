import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import '@/global.css';
import { PortalHost } from '@/components/portal';
import { T } from '@/components/ui';
import { StoreProvider, useStore } from '@/store';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <StoreProvider>
      <PhoneFrame>
        <PortalHost>
          <StatusBar style="dark" />
          <AppStack />
        </PortalHost>
      </PhoneFrame>
    </StoreProvider>
  );
}

function AppStack() {
  const { ready, user } = useStore();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="class/[id]" />
        <Stack.Screen name="join" />
        <Stack.Screen name="account" />
        <Stack.Screen name="card" />
        <Stack.Screen name="centre" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" options={{ animation: 'fade' }} />
      </Stack.Protected>
    </Stack>
  );
}

// On a laptop browser, show the app inside an iPhone-sized frame for demos.
function PhoneFrame({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const framed = Platform.OS === 'web' && width > 600;
  if (!framed) return <>{children}</>;

  const h = Math.min(852, height - 48);
  return (
    <View style={styles.stage}>
      <View style={[styles.device, { height: h, width: 393 }]}>
        <SafeAreaInsetsContext.Provider value={{ top: 54, bottom: 26, left: 0, right: 0 }}>{children}</SafeAreaInsetsContext.Provider>
        <View style={styles.statusBar} pointerEvents="none">
          <T v="smallBold" style={{ width: 54, textAlign: 'center' }}>
            9:41
          </T>
          <View style={styles.island} />
          <View style={{ flexDirection: 'row', gap: 5, width: 54, justifyContent: 'center' }}>
            <Ionicons name="cellular" size={14} color={colors.ink} />
            <Ionicons name="wifi" size={14} color={colors.ink} />
            <Ionicons name="battery-full" size={16} color={colors.ink} />
          </View>
        </View>
        <View style={styles.homeIndicator} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: '#0B0B0C', alignItems: 'center', justifyContent: 'center' },
  device: {
    borderRadius: 54,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: 10,
    borderColor: '#1A1A1D',
    boxShadow: '0 40px 120px rgba(168,29,53,0.25), 0 0 0 1px #2c2c30',
  },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 6 },
  island: { width: 122, height: 34, borderRadius: 20, backgroundColor: '#000' },
  homeIndicator: { position: 'absolute', bottom: 8, alignSelf: 'center', width: 134, height: 5, borderRadius: 3, backgroundColor: colors.ink },
});
