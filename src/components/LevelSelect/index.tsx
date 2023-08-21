import './index.scss';
import { useState } from 'react';
import logo from '~/assets/images/icon_transparent.png';
import type { Level, LevelMetadata, LevelData } from '~/components/LevelView/types';
import LevelCard from '~/components/LevelCard';
import { levelIsSolved } from '~/components/LevelCard/helpers';
import { levelImportersById, levels } from './helpers';

export default function LevelSelect(props: {
  hideCompletedLevels?: boolean;
  levelData?: { [levelId: string]: LevelData };
  onHomeButtonClick: () => void;
  onSelectLevel: (level: Level) => void;
}) {
  const [loading, setLoading] = useState(false);

  function selectLevel(level: LevelMetadata) {
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
