import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Badge, Card, Divider, ListRow, Row, Screen, T, TopBar } from '@/components/ui';
import { CENTRE, HOURS } from '@/data';
import { colors, radius, space } from '@/theme';

const FACILITIES = [
  { icon: 'barbell-outline', title: 'Fitness suite', subtitle: 'Cardio, resistance and free weights' },
  { icon: 'water-outline', title: 'Swimming pool', subtitle: 'Lanes, public swims and aqua classes' },
  { icon: 'trending-up-outline', title: 'Climbing wall', subtitle: 'Bouldering and top-rope' },
  { icon: 'basketball-outline', title: 'Sports hall', subtitle: 'Badminton, five-a-side, netball' },
  { icon: 'flash-outline', title: 'Studios', subtitle: 'Spin, yoga, HIIT and more' },
] as const;

export default function Centre() {
  const today = new Date().getDay();
  // Monday first.
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <Screen>
      <TopBar title="Centre info" />
      <View style={{ height: 170, borderRadius: radius.xl, overflow: 'hidden' }}>
        <Image source={require('@/assets/photos/gym.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['transparent', 'rgba(11,11,12,0.85)']} style={StyleSheet.absoluteFill} />
        <View style={{ position: 'absolute', left: space.lg, bottom: space.lg, right: space.lg }}>
          <T v="heading" color={colors.white}>
            {CENTRE.name}
          </T>
          <T v="small" color="rgba(255,255,255,0.75)">
            {CENTRE.address}
          </T>
        </View>
      </View>

      <T v="heading" style={{ marginTop: space.xxl, marginBottom: space.md }}>
        Opening hours
      </T>
      <Card>
        {order.map((d, i) => {
          const h = HOURS[d];
          const isToday = d === today;
          return (
            <View key={h.day}>
              {i > 0 && <Divider inset={space.lg} />}
              <Row style={{ justifyContent: 'space-between', paddingHorizontal: space.lg, paddingVertical: 14 }}>
                <Row gap={8}>
                  <T v={isToday ? 'bodyBold' : 'body'}>{h.day}</T>
                  {isToday && <Badge label="Today" tone="red" />}
                </Row>
                <T v={isToday ? 'bodyBold' : 'body'} color={isToday ? colors.text : colors.textMuted}>
                  {h.open} – {h.close}
                </T>
              </Row>
            </View>
          );
        })}
      </Card>

      <T v="heading" style={{ marginTop: space.xxl, marginBottom: space.md }}>
        Facilities
      </T>
      <Card>
        {FACILITIES.map((f, i) => (
          <View key={f.title}>
            {i > 0 && <Divider inset={66} />}
            <ListRow icon={f.icon} title={f.title} subtitle={f.subtitle} />
          </View>
        ))}
      </Card>
      <T v="caption" color={colors.textFaint} center style={{ marginTop: space.xl }}>
        Hours shown are demo data for this prototype.
      </T>
    </Screen>
  );
}
