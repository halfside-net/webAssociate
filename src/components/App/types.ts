import type { LevelData } from '~/components/LevelView/types';
import type { Settings } from '~/components/SettingsPage/types';

export interface SavedData {
    activeLevelId?: string,
    levelData: {
        [levelId: string]: LevelData
    },
    settings: Settings,
    /** The version of the saved data format */
    version: number
}