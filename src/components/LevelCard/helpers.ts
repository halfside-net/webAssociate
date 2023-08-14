import type { LevelSolutionData } from '~/components/Level/types';

export function getLevelProgress(levelSize: number, solutionData?: LevelSolutionData) {
  const lettersSolved = Object.values(solutionData ?? {})
    .reduce((total, solution) => total + solution.length, 0);

  return levelSize ? Math.min(lettersSolved / levelSize, 1) : 0
}

export function levelIsSolved(levelSize: number, solutionData?: LevelSolutionData) {
  return getLevelProgress(levelSize, solutionData) >= 1;
}