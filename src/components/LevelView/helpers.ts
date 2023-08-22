import type { LevelMetadata, LevelWords, UnidentifiedLevelMetadata } from './types';

export function levelIdFromFilepath(filepath: string) {
  const parts = filepath.split('/');

  return parts[parts.length - 2] ?? '';
}

export const levelMetadataById = Object.fromEntries(
  Object.entries(import.meta.glob<UnidentifiedLevelMetadata>('~/data/levels/*/meta.json', { eager: true }))
    .map(([filepath, data]): [string, LevelMetadata] => {
      const id = levelIdFromFilepath(filepath);

      return [id, { ...data, id }];
    })
);

export const allLevelMetadata = Object.values(levelMetadataById)
  .sort((a, b) => a.id < b.id ? -1 : 1);

export const levelImportersById = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: LevelWords }>('~/data/levels/*/level.json'))
    .map(([filepath, importer]) => [levelIdFromFilepath(filepath), importer])
);
