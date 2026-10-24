import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { Lion } from '@/components/brand';
import { Button, Field, Row, Screen, T, tap, TopBar } from '@/components/ui';
import { Card as SavedCard, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

const brandOf = (n: string): SavedCard['brand'] => (n.startsWith('5') ? 'Mastercard' : n.startsWith('3') ? 'Amex' : 'Visa');

export default function CardScreen() {
  const { card, saveCard, user } = useStore();
  const [editing, setEditing] = useState(!card);
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const digits = number.replace(/\D/g, '');
  const shown = editing ? (digits.padEnd(16, '•').match(/.{1,4}/g) ?? []).join(' ') : `•••• •••• •••• ${card?.last4}`;

  const save = () => {
    const e: Record<string, string> = {};
    if (digits.length < 15) e.number = 'Card number looks too short';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) e.expiry = 'MM/YY';
    if (cvc.length < 3) e.cvc = '3 digits';
    if (!name.trim()) e.name = 'Name on card';
    setErrors(e);
    if (Object.keys(e).length) return;
    tap('success');
    saveCard({ brand: brandOf(digits), last4: digits.slice(-4), expiry, name: name.trim() });
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <Screen keyboardShouldPersistTaps="handled">
        <TopBar title={editing ? 'Add card' : 'Saved card'} />

        <LinearGradient colors={[colors.ink3, colors.ink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.xl, padding: space.xl, aspectRatio: 1.6, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -30, bottom: -40, opacity: 0.18 }}>
            <Lion size={190} color="red" />
          </View>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ width: 42, height: 30, borderRadius: 6, backgroundColor: '#D4AF37', opacity: 0.85 }} />
            <T v="bodyBold" color={colors.white} style={{ fontStyle: 'italic' }}>
              {editing ? brandOf(digits) : card?.brand}
            </T>
          </Row>
          <View style={{ flex: 1 }} />
          <T color={colors.white} style={{ fontSize: 21, fontWeight: '700', letterSpacing: 2 }}>
            {shown}
          </T>
          <Row style={{ justifyContent: 'space-between', marginTop: space.md }}>
            <T v="smallBold" color="rgba(255,255,255,0.75)">
              {(editing ? name : card?.name) || 'YOUR NAME'}
            </T>
            <T v="smallBold" color="rgba(255,255,255,0.75)">
              {(editing ? expiry : card?.expiry) || 'MM/YY'}
            </T>
          </Row>
        </LinearGradient>

        <Row gap={6} style={{ marginTop: space.lg, marginBottom: space.xl, justifyContent: 'center' }}>
          <Ionicons name="shield-checkmark" size={14} color={colors.green} />
          <T v="caption" color={colors.textMuted}>
            Saved securely. You won&apos;t need to type it again.
          </T>
        </Row>

        {editing ? (
          <>
            <Field
              label="Card number"
              icon="card-outline"
              value={(digits.match(/.{1,4}/g) ?? []).join(' ')}
              onChangeText={(v) => setNumber(v.replace(/\D/g, '').slice(0, 16))}
              keyboardType="number-pad"
              autoComplete="cc-number"
              error={errors.number}
              placeholder="1234 5678 9012 3456"
            />
            <Row gap={space.md} style={{ alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Expiry"
                  value={expiry}
                  onChangeText={(v) => {
                    const d = v.replace(/\D/g, '').slice(0, 4);
                    setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                  }}
                  keyboardType="number-pad"
                  placeholder="MM/YY"
                  error={errors.expiry}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="CVC" value={cvc} onChangeText={(v) => setCvc(v.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" secureTextEntry error={errors.cvc} />
              </View>
            </Row>
            <Field label="Name on card" icon="person-outline" value={name} onChangeText={setName} autoComplete="cc-name" error={errors.name} />
            <Button title="Save card" icon="lock-closed" onPress={save} style={{ marginTop: space.sm }} />
            <T v="caption" color={colors.textMuted} center style={{ marginTop: space.md }}>
              Demo only. Use any test number like 4242 4242 4242 4242.
            </T>
          </>
        ) : (
          <>
            <Button title="Replace card" kind="dark" icon="swap-horizontal" onPress={() => setEditing(true)} />
            <Button
              title="Remove card"
              kind="danger"
              onPress={() => {
                saveCard(null);
                router.back();
              }}
              style={{ marginTop: space.md }}
            />
          </>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}
