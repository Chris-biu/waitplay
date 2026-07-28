import { describe, expect, it } from 'vitest';
import {
  approvedGames,
  contentCandidates,
  findGame,
  getRecommendedGames,
} from '../src/games';

describe('controlled game catalogue', () => {
  it('does not make a pending rights candidate launchable', () => {
    expect(contentCandidates.every((candidate) => candidate.approvalStatus !== 'approved')).toBe(true);
    expect(approvedGames).toEqual([]);
    expect(findGame('2048')).toBeUndefined();
  });

  it('keeps untrusted strings out of the launchable catalogue', () => {
    expect(findGame('https://play2048.co')).toBeUndefined();
    expect(findGame('missing-game')).toBeUndefined();
  });

  it('prioritizes shorter local breaks for shorter waits', () => {
    expect(getRecommendedGames(60).map((game) => game.id)).toEqual(['orbit-drift']);
    expect(getRecommendedGames(90).map((game) => game.id)).toEqual(['orbit-drift', 'tile-garden']);
    expect(getRecommendedGames(120).map((game) => game.id)).toEqual([
      'orbit-drift',
      'tile-garden',
      'signal-lab',
    ]);
  });
});
