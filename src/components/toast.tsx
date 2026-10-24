import { Ionicons } from '@expo/vector-icons';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Lion } from '@/components/brand';
import { T } from '@/components/ui';
import { colors, radius, shadow, space } from '@/theme';

type Toast = { id: number; title: string; body?: string; icon?: string; notification?: boolean };

const ToastCtx = createContext<(t: Omit<Toast, 'id'>) => void>(() => {});

export const useToast = () => useContext(ToastCtx);

// In-app banners, styled like an iOS notification when `notification` is set.
export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);

  const show = (t: Omit<Toast, 'id'>) => {
    const id = next.current++;
    setToasts((all) => [...all.slice(-1), { ...t, id }]);
    setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), t.notification ? 5000 : 2600);
  };

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <View pointerEvents="none" style={[styles.wrap, { top: insets.top + 6 }]}>
        {toasts.map((t) => (
          <Animated.View key={t.id} entering={FadeInUp.springify().damping(16)} exiting={FadeOutUp.duration(200)} style={[styles.toast, t.notification && styles.notification]}>
            {t.notification ? (
              <View style={styles.appIcon}>
                <Lion size={22} />
              </View>
            ) : (
              <Ionicons name={(t.icon ?? 'checkmark-circle') as never} size={22} color={colors.green} />
            )}
            <View style={{ flex: 1 }}>
              {t.notification && (
                <T v="caption" color={colors.textMuted}>
                  DMU LEISURE · now
                </T>
              )}
              <T v="smallBold">{t.title}</T>
              {t.body && (
                <T v="small" color={colors.textMuted}>
                  {t.body}
                </T>
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    </ToastCtx.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: space.md, right: space.md, alignItems: 'center', gap: space.sm },
  toast: { width: '100%', maxWidth: 440, flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow },
  notification: { backgroundColor: '#F7F7F9', borderRadius: 22 },
  appIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
});
