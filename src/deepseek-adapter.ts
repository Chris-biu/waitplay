import type { AiTaskState } from './types';

export type { AiTaskState } from './types';

export interface DeepSeekSignals {
  hostMatches: boolean;
  generatingControlVisible: boolean;
  attentionSignalVisible: boolean;
  composerReady: boolean;
}

export interface DeepSeekDomRoot {
  querySelector(selector: string): Element | null;
}

const generatingControlSelector = [
  'button[aria-label="Stop generating"]',
  'button[aria-label="停止生成"]',
  'button[title="Stop generating"]',
  'button[title="停止生成"]',
].join(', ');

const attentionSignalSelector = '[role="alert"]';
const readyComposerSelector = 'textarea:not([disabled]), [contenteditable="true"][role="textbox"][aria-disabled="false"]';

export function readDeepSeekSignals(root: DeepSeekDomRoot, hostMatches: boolean): DeepSeekSignals {
  return {
    hostMatches,
    generatingControlVisible: root.querySelector(generatingControlSelector) !== null,
    attentionSignalVisible: root.querySelector(attentionSignalSelector) !== null,
    composerReady: root.querySelector(readyComposerSelector) !== null,
  };
}

export function deriveDeepSeekState(signals: DeepSeekSignals, previousState: AiTaskState): AiTaskState {
  if (!signals.hostMatches) return 'unknown';
  if (signals.generatingControlVisible) return 'generating';
  if (signals.attentionSignalVisible) return 'needs_user';
  if (previousState === 'generating' && signals.composerReady) return 'completed';
  return 'unknown';
}
