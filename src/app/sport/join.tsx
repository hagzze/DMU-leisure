import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeInUp, useAnimatedStyle, useSharedValue, withTiming, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Lion } from '@/components/brand';
import { PaySheet } from '@/components/pay-sheet';
import { BackButton, Button, Card, Divider, Field, Press, Row, T } from '@/components/ui';
import { CLUBS, clubById, SNC_PLANS, SOCIETIES, societyById } from '@/sport';
import { useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

type Kind = 'team' | 'snc' | 'society';

const COPY: Record<Kind, { eyebrow: string; choose: string; chooseHint: string }> = {
  team: { eyebrow: 'DMU Team membership', choose: 'Which team are you joining?', chooseHint: 'Pick your club, then your team.' },
  snc: { eyebrow: 'Strength & Conditioning', choose: 'Choose your S&C plan', chooseHint: 'Club Athlete is for DMU Team members.' },
  society: { eyebrow: 'Society membership', choose: 'Which society?', chooseHint: 'You can join more later.' },
};

const STEPS = ['Choose', 'Details', 'Pay'];

export default function SportJoin() {
  const params = useLocalSearchParams<{ kind?: Kind; id?: string }>();
  const kind: Kind = params.kind ?? 'team';
  const insets = useSafeAreaInsets();
  const store = useStore();
  const u = store.user!;

  const [step, setStep] = useState(0);
  const [clubId, setClubId] = useState(kind === 'team' ? params.id : undefined);
  const [team, setTeam] = useState<string>();
  const [planId, setPlanId] = useState(SNC_PLANS[0].id);
  const [societyId, setSocietyId] = useState(kind === 'society' ? params.id : undefined);
  const [form, setForm] = useState({ firstName: u.firstName, lastName: u.lastName, email: u.email, dob: u.dob });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withTiming((step + 1) / STEPS.length, { duration: 300 }));
  }, [step, progress]);
  const bar = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  const club = clubById(clubId);
  const society = societyById(societyId);
  const plan = SNC_PLANS.find((p) => p.id === planId)!;

  const item =
    kind === 'team'
      ? { name: club ? `${club.name} · ${team ?? ''}` : '', price: club?.fee ?? 0, period: 'year' }
      : kind === 'snc'
        ? { name: `S&C ${plan.name}`, price: plan.price, period: plan.period }
        : { name: society?.name ?? '', price: society?.fee ?? 0, period: 'year' };

  const chosen = kind === 'team' ? !!club && !!team : kind === 'snc' ? !!plan : !!society;

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob)) e.dob = 'Use DD/MM/YYYY';
    setErrors(e);
    return Object.values(e).every((x) => !x);
  };

  const next = () => {
    if (step === 1 && !validate()) return;
    if (step === 2) return setPaying(true);
    setStep(step + 1);
  };

  const finish = () => {
    if (kind === 'team' && club && team) store.joinClub(club.id, team, form);
    if (kind === 'snc') store.joinSnc(planId, form);
    if (kind === 'society' && society) store.joinSociety(society.id, form);
    setPaying(false);
    setDone(true);
  };

  if (done) {
    const after = kind === 'team' && club ? () => router.replace({ pathname: '/sport/club/[id]', params: { id: club.id } }) : kind === 'snc' ? () => router.replace('/sport/snc') : () => router.replace('/sport/societies');
    return (
      <View style={{ flex: 1, backgroundColor: colors.ink, paddingTop: insets.top + space.xxxl, paddingHorizontal: space.xl, paddingBottom: insets.bottom + space.xl }}>
        <StatusBar style="light" />
        <Animated.View entering={FadeIn.duration(400)} style={{ alignItems: 'center' }}>
          <Animated.View entering={ZoomIn.delay(150).springify().damping(12)} style={styles.tick}>
            <Ionicons name="checkmark" size={40} color={colors.white} />
          </Animated.View>
          <T v="overline" color={colors.red} style={{ marginTop: space.xl }}>
            Membership active
          </T>
          <T v="title" color={colors.white} center style={{ marginTop: space.sm }}>
            Welcome, {form.firstName}.
          </T>
          <T v="body" color="rgba(255,255,255,0.6)" center style={{ marginTop: space.sm }}>
            {kind === 'team' ? 'Your training and fixtures are now on your home screen. Tap the bell on any session for a reminder.' : kind === 'snc' ? 'Your coached sessions are now on your home screen.' : 'Your committee will be in touch about the next social.'}
          </T>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(350).springify().damping(16)} style={styles.card}>
          <View style={{ position: 'absolute', right: -30, bottom: -40, opacity: 0.2 }}>
            <Lion size={190} />
          </View>
          <Row gap={8}>
            <Lion size={22} color="white" />
            <T v="overline" color={colors.white}>
              {COPY[kind].eyebrow}
            </T>
          </Row>
          <T v="title" color={colors.white} style={{ marginTop: space.xxl }}>
            {kind === 'team' ? club?.name : kind === 'snc' ? 'Strength & Conditioning' : society?.name}
          </T>
          <T v="body" color="rgba(255,255,255,0.7)">
            {kind === 'team' ? team : kind === 'snc' ? plan.name : `${form.firstName} ${form.lastName}`}
          </T>
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Button title={kind === 'team' ? 'See my training' : 'Continue'} onPress={after} />
        <Button title="Go to home" kind="ghostDark" onPress={() => router.replace('/')} style={{ marginTop: space.md }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + space.sm, paddingHorizontal: space.xl }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <BackButton onPress={() => (step === 0 ? router.back() : setStep(step - 1))} />
          <T v="smallBold" color={colors.textMuted}>
            {COPY[kind].eyebrow}
          </T>
          <Press onPress={() => router.back()} haptic={false} style={{ minWidth: 42, alignItems: 'flex-end' }}>
            <T v="smallBold" color={colors.textMuted}>
              Close
            </T>
          </Press>
        </Row>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, bar]} />
        </View>
        <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
          {STEPS.map((s, i) => (
            <T key={s} v="caption" color={i <= step ? colors.ink : colors.textFaint}>
              {s}
            </T>
          ))}
        </Row>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: space.xl, paddingBottom: 130 + insets.bottom }}>
        <Animated.View key={step} entering={FadeInRight.duration(280)}>
          {step === 0 && (
            <>
              <T v="title">{COPY[kind].choose}</T>
              <T v="body" color={colors.textMuted} style={{ marginTop: 4, marginBottom: space.xl }}>
                {COPY[kind].chooseHint}
              </T>

              {kind === 'team' && (
                <>
                  {CLUBS.filter((c) => !params.id || c.id === params.id).map((c) => {
                    const on = c.id === clubId;
                    return (
                      <View key={c.id} style={{ marginBottom: space.sm }}>
                        <Press
                          onPress={() => {
                            setClubId(c.id);
                            setTeam(c.teams.length === 1 ? c.teams[0] : undefined);
                          }}
                          scaleTo={0.98}
                          style={[styles.option, on && styles.optionOn]}>
                          <Ionicons name={c.icon as never} size={20} color={on ? colors.white : colors.ink} />
                          <T v="bodyBold" color={on ? colors.white : colors.text} style={{ flex: 1 }}>
                            {c.name}
                          </T>
                          <T v="smallBold" color={on ? 'rgba(255,255,255,0.7)' : colors.textMuted}>
                            £{c.fee}/yr
                          </T>
                        </Press>
                        {on && (
                          <Animated.View entering={FadeIn.duration(200)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, paddingTop: space.md, paddingLeft: space.sm }}>
                            {c.teams.map((t) => (
                              <Press key={t} onPress={() => setTeam(t)} scaleTo={0.95} style={[styles.teamChip, team === t && { backgroundColor: colors.red, borderColor: colors.red }]}>
                                {team === t && <Ionicons name="checkmark" size={14} color={colors.white} />}
                                <T v="smallBold" color={team === t ? colors.white : colors.ink}>
                                  {t}
                                </T>
                              </Press>
                            ))}
                          </Animated.View>
                        )}
                      </View>
                    );
                  })}
                  {params.id && (
                    <Press onPress={() => router.setParams({ id: '' })} haptic={false} style={{ alignSelf: 'center', marginTop: space.md }}>
                      <T v="smallBold" color={colors.red}>
                        Choose a different club
                      </T>
                    </Press>
                  )}
                </>
              )}

              {kind === 'snc' &&
                SNC_PLANS.map((p) => {
                  const on = p.id === planId;
                  return (
                    <Press key={p.id} onPress={() => setPlanId(p.id)} scaleTo={0.98} style={[styles.option, { marginBottom: space.sm, paddingVertical: space.lg }, on && styles.optionOn]}>
                      <View style={{ flex: 1 }}>
                        <T v="bodyBold" color={on ? colors.white : colors.text}>
                          {p.name}
                        </T>
                        <T v="caption" color={on ? 'rgba(255,255,255,0.7)' : colors.textMuted}>
                          {p.tagline}
                        </T>
                      </View>
                      <T v="heading" color={on ? colors.white : colors.text}>
                        £{p.price}
                      </T>
                    </Press>
                  );
                })}

              {kind === 'society' &&
                SOCIETIES.filter((s) => !store.societies.some((m) => m.societyId === s.id)).map((s) => {
                  const on = s.id === societyId;
                  return (
                    <Press key={s.id} onPress={() => setSocietyId(s.id)} scaleTo={0.98} style={[styles.option, { marginBottom: space.sm }, on && styles.optionOn]}>
                      <Ionicons name={s.icon as never} size={20} color={on ? colors.white : colors.ink} />
                      <T v="bodyBold" color={on ? colors.white : colors.text} style={{ flex: 1 }}>
                        {s.name}
                      </T>
                      <T v="smallBold" color={on ? 'rgba(255,255,255,0.7)' : colors.textMuted}>
                        £{s.fee}
                      </T>
                    </Press>
                  );
                })}
            </>
          )}

          {step === 1 && (
            <>
              <T v="title">Your details</T>
              <Row gap={10} style={{ backgroundColor: colors.greenSoft, borderRadius: radius.md, padding: space.md, marginTop: space.md, marginBottom: space.xl }}>
                <Ionicons name="sparkles" size={18} color={colors.green} />
                <T v="small" color={colors.green} style={{ flex: 1 }}>
                  Filled in from your DMU account. Just check it&apos;s right.
                </T>
              </Row>
              <Field label="First name" value={form.firstName} onChangeText={set('firstName')} error={errors.firstName} autoComplete="given-name" />
              <Field label="Last name" value={form.lastName} onChangeText={set('lastName')} error={errors.lastName} autoComplete="family-name" />
              <Field label="Email address" icon="mail-outline" value={form.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
              <Field label="Date of birth" icon="gift-outline" value={form.dob} onChangeText={set('dob')} error={errors.dob} placeholder="DD/MM/YYYY" keyboardType="numbers-and-punctuation" />
            </>
          )}

          {step === 2 && (
            <>
              <T v="title">Review and pay</T>
              <T v="body" color={colors.textMuted} style={{ marginTop: 4, marginBottom: space.xl }}>
                One payment covers the whole {item.period}.
              </T>
              <Card>
                <Row style={{ justifyContent: 'space-between', padding: space.lg }}>
                  <T v="body" color={colors.textMuted}>
                    Membership
                  </T>
                  <T v="bodyBold" style={{ flexShrink: 1, textAlign: 'right' }}>
                    {item.name}
                  </T>
                </Row>
                <Divider inset={space.lg} />
                <Row style={{ justifyContent: 'space-between', padding: space.lg }}>
                  <T v="body" color={colors.textMuted}>
                    Member
                  </T>
                  <T v="bodyBold">
                    {form.firstName} {form.lastName}
                  </T>
                </Row>
                <Divider inset={space.lg} />
                <Row style={{ justifyContent: 'space-between', padding: space.lg }}>
                  <T v="bodyBold">Due today</T>
                  <T v="title">£{item.price}</T>
                </Row>
              </Card>
            </>
          )}
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        <Button title={step === 2 ? `Pay £${item.price} and join` : 'Continue'} icon={step === 2 ? 'lock-closed' : undefined} disabled={step === 0 && !chosen} onPress={next} />
      </View>

      <PaySheet visible={paying} onClose={() => setPaying(false)} title={item.name} subtitle={`£${item.price} per ${item.period}`} amount={item.price} cta="Join" onPaid={finish} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: colors.line, marginTop: space.lg, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.red, borderRadius: 2 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.xl, paddingTop: space.lg, backgroundColor: colors.bg },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.line },
  optionOn: { backgroundColor: colors.ink, borderColor: colors.ink, ...shadow },
  teamChip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.line },
  tick: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  card: { marginTop: space.xxxl, backgroundColor: colors.ink3, borderRadius: radius.xl, padding: space.xl, overflow: 'hidden' },
});
