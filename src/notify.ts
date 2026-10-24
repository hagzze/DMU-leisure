import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Show reminders as a banner even while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

async function allowed() {
  if (Platform.OS === 'android') {
    // The enum is re-exported through nested `export *`, which the lint rule can't follow.
    // eslint-disable-next-line import/namespace
    await Notifications.setNotificationChannelAsync('reminders', { name: 'Reminders', importance: Notifications.AndroidImportance.HIGH });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

// Schedules a phone notification. Returns its id, or null if permission was refused.
export async function scheduleReminder(title: string, body: string, at: Date): Promise<string | null> {
  if (!(await allowed())) return null;
  const seconds = Math.max(5, Math.round((at.getTime() - Date.now()) / 1000));
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, channelId: 'reminders' },
  });
}

export async function cancelReminder(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}
