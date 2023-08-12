import { WordData } from "~/components/Word/types";

export interface LevelData extends LevelMetaData {
    words: LevelWordData;
}

export interface LevelMetaData extends UnidentifiedLevelMetaData {
    id: string;
}

export interface LevelSolutionData {
    [word: string]: string;
}

export interface LevelWordData {
    [wordId: string]: WordData;
}

export interface UnidentifiedLevelMetaData {
    description?: string;
    height: number;
    name: string;
    size: number;
    width: number;
}