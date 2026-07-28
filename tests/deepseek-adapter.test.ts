import { describe, expect, it } from 'vitest';
import {
  deriveDeepSeekState,
  readDeepSeekSignals,
  type DeepSeekDomRoot,
  type DeepSeekSignals,
} from '../src/deepseek-adapter';

const supportedPage: DeepSeekSignals = {
  hostMatches: true,
  generatingControlVisible: false,
  attentionSignalVisible: false,
  composerReady: true,
};

describe('DeepSeek state adapter', () => {
  it('reports generating when the stop-generation control is visible', () => {
    expect(deriveDeepSeekState({ ...supportedPage, generatingControlVisible: true }, 'unknown')).toBe('generating');
  });

  it('reports completed only after an observed generation ends', () => {
    expect(deriveDeepSeekState(supportedPage, 'generating')).toBe('completed');
  });

  it('reports needs_user when a page-level attention signal is visible', () => {
    expect(deriveDeepSeekState({ ...supportedPage, attentionSignalVisible: true }, 'generating')).toBe('needs_user');
  });

  it('fails safely to unknown before any generation was observed', () => {
    expect(deriveDeepSeekState(supportedPage, 'unknown')).toBe('unknown');
  });

  it('rejects signals from a different host', () => {
    expect(deriveDeepSeekState({ ...supportedPage, hostMatches: false, generatingControlVisible: true }, 'unknown')).toBe('unknown');
  });

  it('reads only the presence of supported UI controls', () => {
    const selectors: string[] = [];
    const root: DeepSeekDomRoot = {
      querySelector(selector) {
        selectors.push(selector);
        return selector.includes('Stop generating') ? {} as Element : null;
      },
    };

    expect(readDeepSeekSignals(root, true)).toEqual({
      hostMatches: true,
      generatingControlVisible: true,
      attentionSignalVisible: false,
      composerReady: false,
    });
    expect(selectors).toHaveLength(3);
  });
});
