export type WaitStatus = 'waiting' | 'recommendation_ready' | 'ended';

export interface Settings {
  thresholdSeconds: 60 | 90 | 120;
  recommendationsEnabled: boolean;
  analyticsEnabled: boolean;
}

export interface WaitSession {
  id: string;
  originalTabId: number;
  startedAt: number;
  thresholdSeconds: number;
  status: WaitStatus;
  recommendationDisabled: boolean;
}

export type AnalyticsEventName =
  | 'wait_started'
  | 'threshold_reached'
  | 'card_shown'
  | 'game_opened'
  | 'game_load_failed'
  | 'wait_ended'
  | 'return_clicked'
  | 'original_tab_focused'
  | 'recommendation_disabled';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  occurredAt: number;
  sessionId?: string;
}

export interface Game {
  id: string;
  name: string;
  durationLabel: string;
  tags: string[];
  pausable: boolean;
  exitHint: string;
}

