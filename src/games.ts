import type { Game } from './types';

export const placeholderGames: readonly Game[] = [
  {
    id: 'orbit-drift',
    name: '轨道漂移',
    durationLabel: '约 2 分钟',
    tags: ['反应', '短局'],
    pausable: true,
    exitHint: '随时关闭标签页即可返回工作。',
  },
  {
    id: 'tile-garden',
    name: '方格花园',
    durationLabel: '约 5 分钟',
    tags: ['轻策略', '放松'],
    pausable: true,
    exitHint: '随时关闭标签页即可返回工作。',
  },
  {
    id: 'signal-lab',
    name: '信号实验室',
    durationLabel: '约 8 分钟',
    tags: ['解谜', '专注'],
    pausable: false,
    exitHint: '退出后本局进度可能丢失。',
  },
];

export function findGame(id: string | null): Game | undefined {
  return placeholderGames.find((game) => game.id === id);
}

