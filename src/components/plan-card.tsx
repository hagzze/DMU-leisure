import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { Badge, Press, Row, T } from '@/components/ui';
import { Plan } from '@/data';
import { colors, radius, space } from '@/theme';

export function PlanCard({ plan, selected, onPress }: { plan: Plan; selected: boolean; onPress: () => void }) {
  return (
    <Press
      onPress={onPress}
      scaleTo={0.98}
      style={{
        backgroundColor: selected ? colors.ink : colors.surface,
        borderRadius: radius.lg,
        padding: space.xl,
        marginBottom: space.md,
        borderWidth: 2,
        borderColor: selected ? colors.ink : colors.line,
      }}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          {plan.popular && (
            <View style={{ marginBottom: space.sm }}>
              <Badge label="Most popular" tone="red" icon="star" />
            </View>
          )}
          <T v="heading" color={selected ? colors.white : colors.text}>
            {plan.name}
          </T>
          <T v="small" color={selected ? 'rgba(255,255,255,0.6)' : colors.textMuted}>
            {plan.tagline}
          </T>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <T v="title" color={selected ? colors.white : colors.text}>
            £{plan.price}
          </T>
          <T v="caption" color={selected ? 'rgba(255,255,255,0.6)' : colors.textMuted}>
            per {plan.period}
          </T>
        </View>
      </Row>
      {selected && (
        <View style={{ marginTop: space.lg, gap: 8 }}>
          {plan.perks.map((p) => (
            <Row key={p} gap={10}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="checkmark" size={13} color={colors.white} />
              </View>
              <T v="small" color={colors.white}>
                {p}
              </T>
            </Row>
          ))}
        </View>
      )}
    </Press>
  );
}
