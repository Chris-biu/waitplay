import type { Game, GameContentCandidate } from './types';

export const contentCandidates: readonly GameContentCandidate[] = [
  { id: '2048', name: '2048', rightsRecord: 'docs/content/2048-review.md', approvalStatus: 'pending' },
  { id: 'flexbox-froggy', name: 'Flexbox Froggy', rightsRecord: 'docs/content/game-rights-ledger.md', approvalStatus: 'pending' },
  { id: 'grid-garden', name: 'Grid Garden', rightsRecord: 'docs/content/game-rights-ledger.md', approvalStatus: 'pending' },
];

export const placeholderGames: readonly Game[] = [
  {
    id: 'orbit-drift',
    suggestedDurationSeconds: 120,
    name: '轨道漂移',
    durationLabel: '约 2 分钟',
    tags: ['反应', '短局'],
    pausable: true,
    exitHint: '随时关闭标签页即可返回工作。',
  },
  {
    id: 'tile-garden',
    suggestedDurationSeconds: 300,
    name: '方格花园',
    durationLabel: '约 5 分钟',
    tags: ['轻策略', '放松'],
    pausable: true,
    exitHint: '随时关闭标签页即可返回工作。',
  },
  {
    id: 'signal-lab',
    suggestedDurationSeconds: 480,
    name: '信号实验室',
    durationLabel: '约 8 分钟',
    tags: ['解谜', '专注'],
    pausable: false,
    exitHint: '退出后本局进度可能丢失。',
  },
];

export const approvedGames: readonly Game[] = [];

const recommendationLimits: Record<60 | 90 | 120, number> = {
  60: 180,
  90: 360,
  120: Number.POSITIVE_INFINITY,
};

export function getRecommendedGames(thresholdSeconds: 60 | 90 | 120): readonly Game[] {
  return [...placeholderGames, ...approvedGames].filter(
    (game) => game.suggestedDurationSeconds <= recommendationLimits[thresholdSeconds],
  );
}

export function findGame(id: string | null): Game | undefined {
  return [...placeholderGames, ...approvedGames].find((game) => game.id === id);
}
