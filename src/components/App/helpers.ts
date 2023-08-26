import type { AppDataV1 } from './types';

export function isAppDataV1(obj: any): obj is AppDataV1 {
  return obj && typeof obj == 'object'
    && 'version' in obj
    && Object.entries(obj).every(([key, value]) => {
      switch (key as keyof AppDataV1) {
        case 'activeLevelId':
          return typeof value === 'string';
        case 'levelsData':
          return value
            && typeof value === 'object'
            && Object.values(value).every(levelData =>
              levelData
                && typeof levelData == 'object'
                && Object.values(levelData).every(levelDataValue => typeof levelDataValue === 'string')
            );
        case 'settings':
          return value && typeof value === 'object';
        case 'version':
          return value === 1;
        default:
          return false;
      }
    });
}
