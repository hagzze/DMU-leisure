import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { useToast } from '@/components/toast';
import { Press, T, tap } from '@/components/ui';
import { dayLabel, time } from '@/format';
import { cancelReminder, scheduleReminder } from '@/notify';
import { useStore } from '@/store';
import { colors, radius } from '@/theme';

type Reminderable = { id: string; title: string; start: string; location: string };

export function useReminders() {
  const { reminders, setReminder } = useStore();
  const toast = useToast();

  const toggle = async (e: Reminderable) => {
    tap();
    const existing = reminders[e.id];
    if (existing) {
      await cancelReminder(existing);
      setReminder(e.id, null);
      toast({ title: 'Reminder off', icon: 'notifications-off' });
      return;
    }
    const at = new Date(new Date(e.start).getTime() - 60 * 60000);
    const id = await scheduleReminder(e.title, `${dayLabel(e.start)} at ${time(e.start)} · ${e.location}`, at);
    if (!id) {
      toast({ title: 'Notifications are off', body: 'Turn them on in Settings to get reminders', icon: 'alert-circle' });
      return;
    }
    setReminder(e.id, id);
    toast({ title: 'Reminder set', body: `We'll notify you at ${time(at)}, an hour before`, icon: 'notifications' });
  };

  // Fires a real notification in 5 seconds so it can be shown live in a demo.
  const sendTest = async (e: Reminderable) => {
    tap();
    const id = await scheduleReminder(`${e.title} soon`, `${dayLabel(e.start)} at ${time(e.start)} · ${e.location}. Don't forget your kit.`, new Date(Date.now() + 5000));
    toast({ title: 'Test notification in 5 seconds', body: 'Lock your phone or go to the home screen to see it', icon: 'time' });
    if (Platform.OS === 'web' && id) {
      setTimeout(() => toast({ notification: true, title: `${e.title} soon`, body: `${dayLabel(e.start)} at ${time(e.start)} · ${e.location}` }), 5000);
    }
  };

  return { isOn: (id: string) => !!reminders[id], toggle, sendTest };
}

export function BellButton({ item, dark, compact }: { item: Reminderable; dark?: boolean; compact?: boolean }) {
  const { isOn, toggle } = useReminders();
  const on = isOn(item.id);
  return (
    <Press
      onPress={() => toggle(item)}
      haptic={false}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: compact ? 0 : 12,
        width: compact ? 36 : undefined,
        justifyContent: 'center',
        height: compact ? 36 : 34,
        borderRadius: radius.pill,
        backgroundColor: on ? (dark ? colors.white : colors.redSoft) : dark ? 'rgba(255,255,255,0.16)' : colors.bg,
      }}>
      <Ionicons name={on ? 'notifications' : 'notifications-outline'} size={15} color={on ? colors.red : dark ? colors.white : colors.ink} />
      {!compact && (
        <T v="caption" color={on ? colors.red : dark ? colors.white : colors.ink}>
          {on ? 'Reminder on' : 'Remind me'}
        </T>
      )}
    </Press>
  );
}
