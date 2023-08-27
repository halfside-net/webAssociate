import type { LevelData } from '~/components/LevelView/types';
import type { Settings } from '~/components/SettingsPage/types';

export interface AppDataV1 {
  activeLevelId?: string,
  levelsData?: {
    [levelId: string]: LevelData
  },
  settings?: Settings,
  /** The version of the app data format */
  version: 1
}
