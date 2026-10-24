// Browser version for laptop demos: uses the web Notification API and a timer.
const timers = new Map<string, ReturnType<typeof setTimeout>>();

async function allowed() {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return (await Notification.requestPermission()) === 'granted';
}

export async function scheduleReminder(title: string, body: string, at: Date): Promise<string | null> {
  const ok = await allowed().catch(() => false);
  const id = `web-${Date.now()}`;
  const ms = Math.max(5000, at.getTime() - Date.now());
  // Browsers drop very long timers; this is only for live demos.
  if (ok && ms < 2 ** 31 - 1) {
    timers.set(id, setTimeout(() => new Notification(title, { body, icon: '/favicon.ico' }), ms));
  }
  return id;
}

export async function cancelReminder(id: string) {
  const t = timers.get(id);
  if (t) clearTimeout(t);
  timers.delete(id);
}
