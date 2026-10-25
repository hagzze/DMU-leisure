import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Lion } from '@/components/brand';
import { Button, Field, Row, Sheet, T, tap, Toggle } from '@/components/ui';
import { useStore } from '@/store';
import { colors, space } from '@/theme';

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const { signIn } = useStore();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('p2581234@my365.dmu.ac.uk');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [stay, setStay] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const submit = () => {
    if (!email.includes('@')) return setError('Enter your university email');
    if (password.length < 4) return setError('Enter your password');
    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      tap('success');
      signIn(email.trim());
    }, 900);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <StatusBar style="light" />
      <Image source={require('@/assets/photos/classes.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={['rgba(11,11,12,0.25)', 'rgba(11,11,12,0.7)', colors.ink]} locations={[0, 0.5, 0.85]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(168,29,53,0.55)', 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0.6 }} style={StyleSheet.absoluteFill} />

      <View style={{ flex: 1, paddingTop: insets.top + space.xxl, paddingHorizontal: space.xxl, paddingBottom: insets.bottom + space.xl }}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <Row gap={10}>
            <View style={styles.badge}>
              <Lion size={30} color="red" />
            </View>
            <T v="overline" color={colors.white}>
              De Montfort University
            </T>
          </Row>
        </Animated.View>

        <View style={{ flex: 1 }} />

        <Animated.View entering={FadeInUp.delay(150).duration(700)}>
          <T v="bodyBold" color={colors.white} style={{ marginBottom: space.md, opacity: 0.9 }}>
            Leisure at DMU
          </T>
          <T style={styles.headline} color={colors.white}>
            All your sport.{'\n'}One app.
          </T>
          <T v="body" color="rgba(255,255,255,0.7)" style={{ marginTop: space.lg, maxWidth: 320 }}>
            The QEII centre, DMU Sport teams, classes and societies. Booked in seconds, paid with Apple Pay.
          </T>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(350).duration(700)} style={{ marginTop: space.xxxl, gap: space.md }}>
          <Button title="Sign in with DMU account" icon="school" onPress={() => setOpen(true)} />
          <Button title="Join as a new member" kind="light" onPress={() => setOpen(true)} />
          <T v="caption" color="rgba(255,255,255,0.45)" center style={{ marginTop: space.sm }}>
            Sign in once. We&apos;ll remember you.
          </T>
        </Animated.View>
      </View>

      <Sheet visible={open} onClose={() => !loading && setOpen(false)}>
        <T v="title">Welcome back</T>
        <T v="small" color={colors.textMuted} style={{ marginTop: 4, marginBottom: space.xl }}>
          Use your DMU login. Demo: any password works.
        </T>
        <Field
          label="University email"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <Field
          label="Password"
          icon="lock-closed-outline"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setError(undefined);
          }}
          secureTextEntry={!show}
          autoComplete="password"
          onSubmitEditing={submit}
          error={error}
          right={<Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} onPress={() => setShow(!show)} />}
        />
        <Row style={{ justifyContent: 'space-between', marginTop: space.xs, marginBottom: space.xl }}>
          <View>
            <T v="bodyBold">Stay signed in</T>
            <T v="caption" color={colors.textMuted}>
              Unlock with Face ID next time
            </T>
          </View>
          <Toggle value={stay} onChange={setStay} />
        </Row>
        <Button title="Sign in" onPress={submit} loading={loading} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  headline: { fontSize: 52, lineHeight: 54, fontWeight: '900', letterSpacing: -2 },
});
