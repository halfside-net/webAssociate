import { LevelSolutionData } from "~/components/Level/types"

export interface SavedData {
    levels: {
        [levelId: string]: LevelSolutionData
    },
    settings: {}
}