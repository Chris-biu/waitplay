import { describe, expect, it } from 'vitest';
import { allowedEventNames, createEvent, isAllowedEventName } from '../src/analytics';
import { findGame } from '../src/games';

describe('analytics event allowlist', () => {
  it('accepts only documented event names', () => {
    expect(isAllowedEventName('wait_started')).toBe(true);
    expect(isAllowedEventName('page_content_read')).toBe(false);
    expect(allowedEventNames).toHaveLength(9);
  });

  it('does not add page or user-content fields', () => {
    expect(createEvent('return_clicked', 'session-1', 1)).toEqual({ name: 'return_clicked', occurredAt: 1, sessionId: 'session-1' });
  });
});

describe('local placeholder catalogue', () => {
  it('exposes only known local game identifiers', () => {
    expect(findGame('orbit-drift')?.name).toBe('轨道漂移');
    expect(findGame('https://untrusted.example')).toBeUndefined();
  });
});
