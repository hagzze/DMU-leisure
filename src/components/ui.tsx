import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ComponentProps, ReactNode, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Portal } from '@/components/portal';
import { colors, radius, shadow, space, type } from '@/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function tap(style: 'light' | 'medium' | 'success' = 'light') {
  if (Platform.OS === 'web') return;
  if (style === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else Haptics.impactAsync(style === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
}

type TProps = TextProps & { v?: keyof typeof type; color?: string; center?: boolean };

export function T({ v = 'body', color = colors.text, center, style, ...rest }: TProps) {
  return <Text {...rest} style={[type[v], { color }, center && { textAlign: 'center' }, style]} />;
}

// Pressable that gently shrinks under your finger.
export function Press({
  children,
  style,
  scaleTo = 0.97,
  haptic = true,
  onPress,
  disabled,
  ...rest
}: Omit<PressableProps, 'style' | 'children'> & { children: ReactNode; style?: StyleProp<ViewStyle>; scaleTo?: number; haptic?: boolean }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={() => s.set(withTiming(scaleTo, { duration: 90 }))}
      onPressOut={() => s.set(withSpring(1, { damping: 14, stiffness: 260 }))}
      onPress={(e) => {
        if (haptic) tap();
        onPress?.(e);
      }}
      style={[style, a, disabled && { opacity: 0.45 }]}>
      {children}
    </AnimatedPressable>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonKind = 'primary' | 'dark' | 'light' | 'ghost' | 'ghostDark' | 'danger';

export function Button({
  title,
  onPress,
  kind = 'primary',
  icon,
  loading,
  disabled,
  style,
  size = 'lg',
}: {
  title: string;
  onPress?: () => void;
  kind?: ButtonKind;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: 'lg' | 'md' | 'sm';
}) {
  const bg = { primary: colors.red, dark: colors.ink, light: colors.white, ghost: 'transparent', ghostDark: 'transparent', danger: colors.redSoft }[kind];
  const fg = { primary: colors.white, dark: colors.white, light: colors.ink, ghost: colors.ink, ghostDark: colors.white, danger: colors.red }[kind];
  const h = { lg: 56, md: 46, sm: 36 }[size];
  return (
    <Press
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: bg, height: h, paddingHorizontal: size === 'sm' ? 14 : 22 },
        kind === 'ghost' && { borderWidth: 1, borderColor: colors.line },
        kind === 'ghostDark' && { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={size === 'sm' ? 16 : 19} color={fg} />}
          <T v={size === 'sm' ? 'smallBold' : 'bodyBold'} color={fg}>
            {title}
          </T>
        </>
      )}
    </Press>
  );
}

export function Card({ children, style, dark }: { children: ReactNode; style?: StyleProp<ViewStyle>; dark?: boolean }) {
  return <View style={[styles.card, dark && { backgroundColor: colors.ink }, style]}>{children}</View>;
}

export function Badge({ label, tone = 'neutral', icon }: { label: string; tone?: 'neutral' | 'red' | 'green' | 'amber' | 'dark'; icon?: IconName }) {
  const map = {
    neutral: [colors.bg, colors.textMuted],
    red: [colors.redSoft, colors.red],
    green: [colors.greenSoft, colors.green],
    amber: [colors.amberSoft, colors.amber],
    dark: ['rgba(255,255,255,0.14)', colors.white],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {icon && <Ionicons name={icon} size={12} color={fg} />}
      <T v="caption" color={fg}>
        {label}
      </T>
    </View>
  );
}

export function Chip({ label, active, onPress, icon }: { label: string; active?: boolean; onPress?: () => void; icon?: IconName }) {
  return (
    <Press onPress={onPress} style={[styles.chip, active && { backgroundColor: colors.ink, borderColor: colors.ink }]}>
      {icon && <Ionicons name={icon} size={15} color={active ? colors.white : colors.ink} />}
      <T v="smallBold" color={active ? colors.white : colors.ink}>
        {label}
      </T>
    </Press>
  );
}

export function IconTile({ name, bg = colors.redSoft, fg = colors.red, size = 40 }: { name: IconName; bg?: string; fg?: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.32, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={size * 0.5} color={fg} />
    </View>
  );
}

export function Row({ children, style, gap = space.sm }: { children: ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginLeft: inset }} />;
}

export function ListRow({
  icon,
  title,
  subtitle,
  right,
  onPress,
  tone,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
  tone?: 'red';
}) {
  const body = (
    <Row gap={space.md} style={{ paddingVertical: 14, paddingHorizontal: space.lg }}>
      {icon && <IconTile name={icon} size={34} bg={tone ? colors.redSoft : colors.bg} fg={tone ? colors.red : colors.ink} />}
      <View style={{ flex: 1 }}>
        <T v="bodyBold" color={tone ? colors.red : colors.text}>
          {title}
        </T>
        {subtitle && (
          <T v="small" color={colors.textMuted}>
            {subtitle}
          </T>
        )}
      </View>
      {right ?? (onPress && <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />)}
    </Row>
  );
  return onPress ? (
    <Press onPress={onPress} scaleTo={0.99}>
      {body}
    </Press>
  ) : (
    body
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <Row style={{ justifyContent: 'space-between', marginBottom: space.md, marginTop: space.xxl }}>
      <T v="heading">{title}</T>
      {action && (
        <Press onPress={onAction} haptic={false}>
          <T v="smallBold" color={colors.red}>
            {action}
          </T>
        </Press>
      )}
    </Row>
  );
}

// Scrollable screen with safe-area padding and room for the floating tab bar.
export function Screen({ children, tabs, contentStyle, ...rest }: ScrollViewProps & { tabs?: boolean; contentStyle?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      {...rest}
      style={[{ flex: 1, backgroundColor: colors.bg }, rest.style]}
      contentContainerStyle={[
        { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + (tabs ? 120 : 40), paddingHorizontal: space.xl },
        contentStyle,
      ]}>
      {children}
    </ScrollView>
  );
}

export function BackButton({ dark, onPress }: { dark?: boolean; onPress?: () => void }) {
  return (
    <Press
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      style={[styles.round, dark ? { backgroundColor: 'rgba(0,0,0,0.45)' } : { backgroundColor: colors.surface, ...shadow }]}>
      <Ionicons name="chevron-back" size={22} color={dark ? colors.white : colors.ink} />
    </Press>
  );
}

export function TopBar({ title, right, onBack }: { title?: string; right?: ReactNode; onBack?: () => void }) {
  return (
    <Row style={{ justifyContent: 'space-between', marginBottom: space.lg }}>
      <BackButton onPress={onBack} />
      {title && <T v="bodyBold">{title}</T>}
      <View style={{ minWidth: 42, alignItems: 'flex-end' }}>{right}</View>
    </Row>
  );
}

// Modern form field: the label sits inside the box and floats up when you type.
export function Field({
  label,
  value,
  onChangeText,
  error,
  hint,
  icon,
  right,
  ...rest
}: TextInputProps & { label: string; error?: string; hint?: string; icon?: IconName; right?: ReactNode }) {
  const [focused, setFocused] = useState(false);
  const up = useSharedValue(value ? 1 : 0);
  const f = useSharedValue(0);

  useEffect(() => {
    up.set(withTiming(focused || !!value ? 1 : 0, { duration: 160 }));
    f.set(withTiming(focused ? 1 : 0, { duration: 160 }));
  }, [focused, value, up, f]);

  const labelStyle = useAnimatedStyle(() => ({
    top: interpolate(up.get(), [0, 1], [19, 9]),
    fontSize: interpolate(up.get(), [0, 1], [16, 12]),
  }));
  const boxStyle = useAnimatedStyle(() => ({
    borderColor: error ? colors.red : interpolateColor(f.get(), [0, 1], [colors.line, colors.ink]),
  }));

  return (
    <View style={{ marginBottom: space.md }}>
      <Animated.View style={[styles.field, boxStyle]}>
        {icon && <Ionicons name={icon} size={19} color={colors.textMuted} style={{ marginRight: 10 }} />}
        <View style={{ flex: 1, height: '100%' }}>
          <Animated.Text style={[styles.fieldLabel, type.small, { color: error ? colors.red : colors.textMuted }, labelStyle]} pointerEvents="none">
            {label}
          </Animated.Text>
          <TextInput
            {...rest}
            value={value}
            onChangeText={onChangeText}
            onFocus={(e) => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
            placeholderTextColor={colors.textFaint}
            placeholder={focused ? rest.placeholder : undefined}
            style={[styles.fieldInput, type.body]}
          />
        </View>
        {right}
      </Animated.View>
      {(error || hint) && (
        <T v="caption" color={error ? colors.red : colors.textMuted} style={{ marginTop: 6, marginLeft: 4 }}>
          {error ?? hint}
        </T>
      )}
    </View>
  );
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const x = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    x.set(withSpring(value ? 1 : 0, { damping: 16, stiffness: 220 }));
  }, [value, x]);
  const track = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(x.get(), [0, 1], ['#DCDCE0', colors.red]) }));
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() * 20 }] }));
  return (
    <Pressable
      onPress={() => {
        tap();
        onChange(!value);
      }}>
      <Animated.View style={[styles.toggle, track]}>
        <Animated.View style={[styles.knob, knob]} />
      </Animated.View>
    </Pressable>
  );
}

// Bottom sheet that slides up over the current screen.
export function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const p = useSharedValue(0);
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      p.set(withSpring(1, { damping: 22, stiffness: 210, mass: 0.9 }));
    } else if (mounted) {
      p.set(withTiming(0, { duration: 200 }));
      const t = setTimeout(() => setMounted(false), 210);
      return () => clearTimeout(t);
    }
  }, [visible, mounted, p]);

  const backdrop = useAnimatedStyle(() => ({ opacity: p.get() }));
  const panel = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - p.get()) * 700 }] }));

  if (!mounted) return null;
  return (
    <Portal>
      <View style={styles.sheetRoot}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdrop]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + space.xl }, panel]}>
          <View style={styles.grabber} />
          {children}
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadow },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 15, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  round: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  field: { height: 60, borderRadius: radius.md, borderWidth: 1.5, backgroundColor: colors.surface, paddingHorizontal: space.lg, flexDirection: 'row', alignItems: 'center' },
  fieldLabel: { position: 'absolute', left: 0 },
  fieldInput: { flex: 1, paddingTop: 22, paddingBottom: 6, color: colors.text, paddingHorizontal: 0 },
  toggle: { width: 50, height: 30, borderRadius: 15, padding: 3 },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.white, ...shadow },
  sheetRoot: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  backdrop: { backgroundColor: 'rgba(11,11,12,0.45)' },
  sheet: { width: '100%', maxWidth: 520, backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: space.xl, paddingTop: 10 },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line, marginBottom: space.lg },
});
