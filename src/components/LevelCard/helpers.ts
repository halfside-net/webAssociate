import type { LevelData } from '~/components/Game/types';

export function getLevelProgress(levelSize: number, solutionData?: LevelData) {
  const lettersSolved = Object.values(solutionData ?? {})
    .reduce((total, solution) => total + solution.length, 0);

  return levelSize ? Math.min(lettersSolved / levelSize, 1) : 0
}

export function levelIsSolved(levelSize: number, solutionData?: LevelData) {
  return getLevelProgress(levelSize, solutionData) >= 1;
}
