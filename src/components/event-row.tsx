import { View } from 'react-native';

import { BellButton } from '@/components/reminders';
import { Row, T } from '@/components/ui';
import { endTime, time } from '@/format';
import { TeamEvent } from '@/sport';
import { colors, radius, shadow, space } from '@/theme';

export function EventRow({ event, short }: { event: TeamEvent; short?: boolean }) {
  const fixture = /fixture|game/i.test(event.title);
  const d = new Date(event.start);
  return (
    <Row gap={space.md} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, marginBottom: space.sm, ...shadow }}>
      <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: fixture ? colors.red : colors.ink, alignItems: 'center', justifyContent: 'center' }}>
        <T v="caption" color="rgba(255,255,255,0.7)">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]}
        </T>
        <T v="heading" color={colors.white}>
          {d.getDate()}
        </T>
      </View>
      <View style={{ flex: 1 }}>
        <T v="bodyBold" numberOfLines={1}>
          {short ? event.label : event.title}
        </T>
        <T v="caption" color={colors.textMuted}>
          {time(event.start)}–{endTime(event.start, event.minutes)} · {event.venue}
        </T>
      </View>
      <BellButton item={{ id: event.id, title: event.title, start: event.start, location: event.venue }} />
    </Row>
  );
}
