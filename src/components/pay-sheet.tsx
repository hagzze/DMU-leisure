import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Badge, Button, Divider, Press, Row, Sheet, T, tap } from '@/components/ui';
import { money } from '@/format';
import { useStore } from '@/store';
import { colors, radius, space } from '@/theme';

type Method = 'applepay' | 'card';

// Demo checkout: looks and feels like Apple Pay, but no money moves.
export function PaySheet({
  visible,
  onClose,
  title,
  subtitle,
  amount,
  cta = 'Pay',
  onPaid,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  amount: number;
  cta?: string;
  onPaid: (method: Method) => void;
}) {
  const { card } = useStore();
  const [method, setMethod] = useState<Method>('applepay');
  const [stage, setStage] = useState<'choose' | 'paying' | 'done'>('choose');

  // Start fresh each time the sheet opens.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setStage('choose');
  }

  const pay = () => {
    tap('medium');
    setStage('paying');
    setTimeout(() => {
      tap('success');
      setStage('done');
      setTimeout(() => onPaid(method), 900);
    }, 1300);
  };

  return (
    <Sheet visible={visible} onClose={stage === 'paying' ? () => {} : onClose}>
      {stage === 'choose' && (
        <View>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <T v="overline" color={colors.textMuted}>
                Checkout
              </T>
              <T v="title" style={{ marginTop: 4 }}>
                {title}
              </T>
              {subtitle && (
                <T v="small" color={colors.textMuted} style={{ marginTop: 2 }}>
                  {subtitle}
                </T>
              )}
            </View>
            <T v="title">{money(amount)}</T>
          </Row>

          <T v="smallBold" color={colors.textMuted} style={{ marginTop: space.xxl, marginBottom: space.sm }}>
            Pay with
          </T>
          <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' }}>
            <MethodRow
              active={method === 'applepay'}
              onPress={() => setMethod('applepay')}
              icon={<Ionicons name="logo-apple" size={20} color={colors.white} />}
              iconBg={colors.ink}
              title="Apple Pay"
              subtitle="Double-click to pay"
            />
            <Divider inset={64} />
            {card ? (
              <MethodRow
                active={method === 'card'}
                onPress={() => setMethod('card')}
                icon={<T v="caption" color={colors.white} style={{ fontWeight: '900', fontStyle: 'italic' }}>VISA</T>}
                iconBg="#1A1F71"
                title={`${card.brand} •••• ${card.last4}`}
                subtitle={`Saved card · expires ${card.expiry}`}
              />
            ) : (
              <MethodRow
                onPress={() => {
                  onClose();
                  router.push('/card');
                }}
                icon={<Ionicons name="add" size={20} color={colors.ink} />}
                iconBg={colors.bg}
                title="Add a card"
                subtitle="Saved securely for next time"
              />
            )}
          </View>

          <Row gap={6} style={{ marginTop: space.lg, justifyContent: 'center' }}>
            <Ionicons name="lock-closed" size={13} color={colors.textMuted} />
            <T v="caption" color={colors.textMuted}>
              Demo checkout. No real payment is taken.
            </T>
          </Row>

          {method === 'applepay' ? (
            <Press onPress={pay} style={{ marginTop: space.lg, height: 56, borderRadius: radius.pill, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <T v="bodyBold" color={colors.white}>
                {cta} with
              </T>
              <Ionicons name="logo-apple" size={20} color={colors.white} />
              <T v="bodyBold" color={colors.white} style={{ marginLeft: -4 }}>
                Pay
              </T>
            </Press>
          ) : (
            <Button title={`${cta} ${money(amount)}`} onPress={pay} style={{ marginTop: space.lg }} />
          )}
        </View>
      )}

      {stage !== 'choose' && (
        <View style={{ alignItems: 'center', paddingVertical: space.xxxl }}>
          {stage === 'paying' ? (
            <>
              <View style={{ width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={method === 'applepay' ? 'scan-outline' : 'card-outline'} size={38} color={colors.ink} />
              </View>
              <ActivityIndicator style={{ marginTop: space.xl }} color={colors.ink} />
              <T v="bodyBold" style={{ marginTop: space.md }}>
                {method === 'applepay' ? 'Confirming with Face ID' : 'Processing payment'}
              </T>
            </>
          ) : (
            <>
              <Animated.View entering={ZoomIn.springify().damping(12)} style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="checkmark" size={46} color={colors.white} />
              </Animated.View>
              <T v="title" style={{ marginTop: space.xl }}>
                Done
              </T>
              <T v="small" color={colors.textMuted}>
                {money(amount)} paid
              </T>
            </>
          )}
        </View>
      )}
    </Sheet>
  );
}

function MethodRow({
  active,
  onPress,
  icon,
  iconBg,
  title,
  subtitle,
}: {
  active?: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Press onPress={onPress} scaleTo={0.99} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, backgroundColor: colors.surface }}>
      <View style={{ width: 40, height: 28, borderRadius: 6, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <View style={{ flex: 1 }}>
        <T v="bodyBold">{title}</T>
        <T v="caption" color={colors.textMuted}>
          {subtitle}
        </T>
      </View>
      {active !== undefined && (
        <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: active ? colors.red : colors.line, alignItems: 'center', justifyContent: 'center' }}>
          {active && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.red }} />}
        </View>
      )}
      {active === undefined && <Badge label="New" tone="red" />}
    </Press>
  );
}
