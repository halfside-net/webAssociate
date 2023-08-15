import './index.scss';
import { useState } from 'react';
import logo from '~/assets/images/icon_transparent.png';
import type { LevelData, LevelMetaData, LevelSolutionData, LevelWordData, UnidentifiedLevelMetaData } from '~/components/Level/types';
import LevelCard from '~/components/LevelCard';
import { levelIsSolved } from '~/components/LevelCard/helpers';

function levelIdFromFilepath(filepath: string) {
  const parts = filepath.split('/');

  return parts[parts.length - 2] ?? '';
}

const levels = Object.entries(import.meta.glob<UnidentifiedLevelMetaData>('~/data/levels/*/meta.json', { eager: true }))
  .map(([filepath, data]): LevelMetaData => ({ ...data, id: levelIdFromFilepath(filepath) }))
  .sort((a, b) => a.id < b.id ? -1 : 1);
const levelImportersById = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: LevelWordData }>('~/data/levels/*/level.json'))
    .map(([filepath, importer]) => [levelIdFromFilepath(filepath), importer])
);

export default function LevelSelect(props: {
  hideCompletedLevels?: boolean;
  levelData?: { [levelId: string]: LevelSolutionData };
  onHomeButtonClick: () => void;
  onSelectLevel: (level: LevelData) => void;
}) {
  const [loading, setLoading] = useState(false);

  function selectLevel(level: LevelMetaData) {
    if (!loading) {
      setLoading(true);
      levelImportersById[level.id]()
        .then(({ default: words }) => {
          setLoading(false);
          props.onSelectLevel({ ...level, words });
        });
    }
  }

  return (
    <div className="LevelSelect">
      <button
        aria-label="Home"
        className="LevelSelect-homeButton"
        onClick={props.onHomeButtonClick}
      >
        <img
          alt="webAssociate"
          className="App-homeButtonIcon"
          src={logo}
        />
      </button>
      <div className="LevelSelect-list">
        {levels
          .filter(level => !props.hideCompletedLevels || !levelIsSolved(level.size, props.levelData?.[level.id]))
          .map(level => (
            <div
              className="LevelSelect-card"
              key={level.id}
            >
              <LevelCard
                description={level.description}
                name={level.name}
                onSelect={() => selectLevel(level)}
                size={level.size}
                solutionData={props.levelData?.[level.id]}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}
