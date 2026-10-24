import { View } from 'react-native';

import { BellButton } from '@/components/reminders';
import { Button, Row, T } from '@/components/ui';
import { endTime, time } from '@/format';
import { TeamEvent } from '@/sport';
import { colors, radius, shadow, space } from '@/theme';

// One session row. With `onToggleBook`, it also books the session; for away venues the bus is booked with it.
export function EventRow({ event, short, booked, onToggleBook }: { event: TeamEvent; short?: boolean; booked?: boolean; onToggleBook?: () => void }) {
  const fixture = /fixture|game/i.test(event.title);
  const needsBus = event.venue === 'Beaumont Park';
  const d = new Date(event.start);
  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, marginBottom: space.sm, ...shadow }}>
      <Row gap={space.md}>
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
        <BellButton item={{ id: event.id, title: event.title, start: event.start, location: event.venue }} compact={!!onToggleBook} />
      </Row>
      {onToggleBook && (
        <Button
          title={booked ? (needsBus ? 'Booked · training and bus' : 'Booked') : needsBus ? 'Book training and transport' : 'Book training'}
          icon={booked ? 'checkmark-circle' : needsBus ? 'bus' : 'add'}
          kind={booked ? 'ghost' : 'primary'}
          size="md"
          onPress={onToggleBook}
          style={{ marginTop: space.md }}
        />
      )}
    </View>
  );
}
