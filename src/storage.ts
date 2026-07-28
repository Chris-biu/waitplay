import type { AnalyticsEvent, Settings, WaitSession } from './types';

const settingsKey = 'settings';
const sessionKey = 'session';
const eventsKey = 'events';

export const defaultSettings: Settings = {
  thresholdSeconds: 90,
  recommendationsEnabled: true,
  analyticsEnabled: false,
};

export async function getSettings(): Promise<Settings> {
  const stored = await browser.storage.local.get(settingsKey);
  return { ...defaultSettings, ...(stored[settingsKey] as Partial<Settings> | undefined) };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await browser.storage.local.set({ [settingsKey]: settings });
}

export async function getSession(): Promise<WaitSession | undefined> {
  const stored = await browser.storage.local.get(sessionKey);
  return stored[sessionKey] as WaitSession | undefined;
}

export async function saveSession(session: WaitSession): Promise<void> {
  await browser.storage.local.set({ [sessionKey]: session });
}

export async function clearSession(): Promise<void> {
  await browser.storage.local.remove(sessionKey);
}

export async function appendEvent(event: AnalyticsEvent): Promise<void> {
  const stored = await browser.storage.local.get(eventsKey);
  const events = (stored[eventsKey] as AnalyticsEvent[] | undefined) ?? [];
  await browser.storage.local.set({ [eventsKey]: [...events, event].slice(-200) });
}

export async function getEvents(): Promise<AnalyticsEvent[]> {
  const stored = await browser.storage.local.get(eventsKey);
  return (stored[eventsKey] as AnalyticsEvent[] | undefined) ?? [];
}
