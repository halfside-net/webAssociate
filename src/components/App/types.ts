import type { LevelSolutionData } from '~/components/Level/types';
import type { Settings } from '~/components/SettingsPage/types';

export interface SavedData {
    levels: {
        [levelId: string]: LevelSolutionData
    },
    settings: Settings
}