import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, useAnimatedStyle, useSharedValue, withTiming, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MemberCard } from '@/components/brand';
import { PaySheet } from '@/components/pay-sheet';
import { PlanCard } from '@/components/plan-card';
import { BackButton, Button, Card, Divider, Field, Press, Row, T, Toggle } from '@/components/ui';
import { PLANS } from '@/data';
import { planById, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

const STEPS = ['Plan', 'Details', 'Health', 'Pay'];

const HEALTH = [
  'Has a doctor ever said you have a heart condition?',
  'Do you get chest pain or dizziness during exercise?',
  'Are you pregnant or recently had a baby?',
  'Do you have an injury that exercise could make worse?',
];

export default function Join() {
  const params = useLocalSearchParams<{ plan?: string }>();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const u = store.user!;

  // Skip the plan step if one was already picked on the Membership tab.
  const [step, setStep] = useState(params.plan ? 1 : 0);
  const [planId, setPlanId] = useState(params.plan ?? PLANS[0].id);
  const [form, setForm] = useState({ firstName: u.firstName, lastName: u.lastName, email: u.email, studentId: u.studentId, phone: u.phone, dob: u.dob });
  const [health, setHealth] = useState(HEALTH.map(() => false));
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const plan = planById(planId)!;
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withTiming((step + 1) / STEPS.length, { duration: 300 }));
  }, [step, progress]);
  const bar = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!/^P\d{7}$/i.test(form.studentId)) e.studentId = 'Starts with P, then 7 numbers';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a UK mobile number';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob)) e.dob = 'Use DD/MM/YYYY';
    setErrors(e);
    return Object.values(e).every((x) => !x);
  };

  const next = () => {
    if (step === 1 && !validate()) return;
    if (step === 3) return setPaying(true);
    setStep(step + 1);
  };

  const flagged = health.some(Boolean);
  const canContinue = step !== 2 || terms;

  if (done) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ink, paddingTop: insets.top + space.xxxl, paddingHorizontal: space.xl, paddingBottom: insets.bottom + space.xl }}>
        <StatusBar style="light" />
        <Animated.View entering={FadeIn.duration(500)} style={{ alignItems: 'center' }}>
          <Animated.View entering={ZoomIn.delay(150).springify().damping(12)} style={styles.tick}>
            <Ionicons name="checkmark" size={40} color={colors.white} />
          </Animated.View>
          <T v="overline" color={colors.red} style={{ marginTop: space.xl }}>
            Welcome to DMU Leisure
          </T>
          <T v="title" color={colors.white} center style={{ marginTop: space.sm }}>
            You&apos;re a member, {form.firstName}.
          </T>
          <T v="body" color="rgba(255,255,255,0.6)" center style={{ marginTop: space.sm }}>
            Your card is in the app. Scan it at the gate, and every class is now free to book.
          </T>
        </Animated.View>
        <Animated.View entering={FadeInRight.delay(400).springify().damping(16)} style={{ marginTop: space.xxxl }}>
          {store.membership && <MemberCard user={{ ...u, ...form }} membership={store.membership} />}
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Button title="Book my first class" onPress={() => router.replace('/qe2')} />
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
            Step {step + 1} of {STEPS.length}
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
        <Animated.View key={step} entering={FadeInRight.duration(300)}>
          {step === 0 && (
            <>
              <T v="title">Choose your membership</T>
              <T v="body" color={colors.textMuted} style={{ marginTop: 4, marginBottom: space.xl }}>
                You can switch plans any time.
              </T>
              {PLANS.map((p) => (
                <PlanCard key={p.id} plan={p} selected={planId === p.id} onPress={() => setPlanId(p.id)} />
              ))}
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
              <Row gap={space.md} style={{ alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Field label="First name" value={form.firstName} onChangeText={set('firstName')} error={errors.firstName} autoComplete="given-name" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Last name" value={form.lastName} onChangeText={set('lastName')} error={errors.lastName} autoComplete="family-name" />
                </View>
              </Row>
              <Field label="Email" icon="mail-outline" value={form.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
              <Field label="Student number" icon="school-outline" value={form.studentId} onChangeText={set('studentId')} error={errors.studentId} autoCapitalize="characters" />
              <Field label="Mobile" icon="call-outline" value={form.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" hint="For class reminders and changes" />
              <Field label="Date of birth" icon="gift-outline" value={form.dob} onChangeText={set('dob')} error={errors.dob} placeholder="DD/MM/YYYY" keyboardType="numbers-and-punctuation" />
            </>
          )}

          {step === 2 && (
            <>
              <T v="title">Quick health check</T>
              <T v="body" color={colors.textMuted} style={{ marginTop: 4, marginBottom: space.xl }}>
                Four questions to keep you safe. Answers stay private.
              </T>
              <Card>
                {HEALTH.map((q, i) => (
                  <View key={q}>
                    {i > 0 && <Divider inset={space.lg} />}
                    <Row gap={space.lg} style={{ padding: space.lg }}>
                      <T v="body" style={{ flex: 1 }}>
                        {q}
                      </T>
                      <Toggle value={health[i]} onChange={(v) => setHealth((h) => h.map((x, j) => (j === i ? v : x)))} />
                    </Row>
                  </View>
                ))}
              </Card>
              {flagged && (
                <Animated.View entering={FadeIn}>
                  <Row gap={10} style={{ backgroundColor: colors.amberSoft, borderRadius: radius.md, padding: space.md, marginTop: space.lg, alignItems: 'flex-start' }}>
                    <Ionicons name="information-circle" size={18} color={colors.amber} />
                    <T v="small" color={colors.amber} style={{ flex: 1 }}>
                      No problem. A member of the team will have a quick chat with you on your first visit.
                    </T>
                  </Row>
                </Animated.View>
              )}
              <Press onPress={() => setTerms(!terms)} scaleTo={0.99} style={{ marginTop: space.xl }}>
                <Row gap={space.md} style={{ alignItems: 'flex-start' }}>
                  <View style={[styles.check, terms && { backgroundColor: colors.red, borderColor: colors.red }]}>{terms && <Ionicons name="checkmark" size={16} color={colors.white} />}</View>
                  <T v="small" color={colors.textMuted} style={{ flex: 1 }}>
                    I agree to the <T v="smallBold">membership terms</T> and the <T v="smallBold">centre rules</T>.
                  </T>
                </Row>
              </Press>
            </>
          )}

          {step === 3 && (
            <>
              <T v="title">Review and pay</T>
              <T v="body" color={colors.textMuted} style={{ marginTop: 4, marginBottom: space.xl }}>
                First payment today, then every {plan.period}.
              </T>
              <Card>
                <SummaryRow label="Plan" value={plan.name} />
                <Divider inset={space.lg} />
                <SummaryRow label="Member" value={`${form.firstName} ${form.lastName}`} />
                <Divider inset={space.lg} />
                <SummaryRow label="Student number" value={form.studentId.toUpperCase()} />
                <Divider inset={space.lg} />
                <SummaryRow label="Joining fee" value="£0" />
                <Divider inset={space.lg} />
                <Row style={{ justifyContent: 'space-between', padding: space.lg }}>
                  <T v="bodyBold">Due today</T>
                  <T v="title">£{plan.price}</T>
                </Row>
              </Card>
              <Press onPress={() => setStep(0)} haptic={false} style={{ marginTop: space.lg, alignSelf: 'center' }}>
                <T v="smallBold" color={colors.red}>
                  Change plan
                </T>
              </Press>
            </>
          )}
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        <Button title={step === 3 ? `Pay £${plan.price} and join` : 'Continue'} icon={step === 3 ? 'lock-closed' : undefined} disabled={!canContinue} onPress={next} />
      </View>

      <PaySheet
        visible={paying}
        onClose={() => setPaying(false)}
        title={plan.name}
        subtitle={`£${plan.price} per ${plan.period}`}
        amount={plan.price}
        cta="Join"
        onPaid={() => {
          store.join(planId, form);
          setPaying(false);
          setDone(true);
        }}
      />
    </KeyboardAvoidingView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Row style={{ justifyContent: 'space-between', padding: space.lg }}>
      <T v="body" color={colors.textMuted}>
        {label}
      </T>
      <T v="bodyBold">{value}</T>
    </Row>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: colors.line, marginTop: space.lg, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.red, borderRadius: 2 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.xl, paddingTop: space.lg, backgroundColor: colors.bg },
  check: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  tick: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
});
