import type { AnalyticsEvent, AnalyticsEventName } from './types';

export const allowedEventNames: readonly AnalyticsEventName[] = [
  'wait_started',
  'threshold_reached',
  'card_shown',
  'game_opened',
  'game_load_failed',
  'wait_ended',
  'return_clicked',
  'original_tab_focused',
  'recommendation_disabled',
];

export function isAllowedEventName(value: string): value is AnalyticsEventName {
  return allowedEventNames.includes(value as AnalyticsEventName);
}

export function createEvent(
  name: AnalyticsEventName,
  sessionId?: string,
  occurredAt = Date.now(),
): AnalyticsEvent {
  return { name, occurredAt, ...(sessionId ? { sessionId } : {}) };
}

