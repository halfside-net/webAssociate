import type { Word } from '~/components/WordView/types';

export interface GameData {
  [levelId: string]: LevelData
}

/**
 * The base data for a Level
 */
export interface Level extends LevelMetadata {
  words: LevelWords;
}

/**
 * The user's data for a Level
 */
export interface LevelData {
  [word: string]: string;
}

export interface LevelMetadata extends UnidentifiedLevelMetadata {
  id: string;
}

export interface LevelWords {
  [wordId: string]: Word;
}

export interface UnidentifiedLevelMetadata {
  description?: string;
  height: number;
  name: string;
  size: number;
  width: number;
}
