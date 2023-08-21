import type { LevelMetadata, LevelWords, UnidentifiedLevelMetadata } from '~/components/LevelView/types';

export function levelIdFromFilepath(filepath: string) {
  const parts = filepath.split('/');

  return parts[parts.length - 2] ?? '';
}

export const levels = Object.entries(import.meta.glob<UnidentifiedLevelMetadata>('~/data/levels/*/meta.json', { eager: true }))
  .map(([filepath, data]): LevelMetadata => ({ ...data, id: levelIdFromFilepath(filepath) }))
  .sort((a, b) => a.id < b.id ? -1 : 1);
export const levelImportersById = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: LevelWords }>('~/data/levels/*/level.json'))
    .map(([filepath, importer]) => [levelIdFromFilepath(filepath), importer])
);
