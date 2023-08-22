import './index.scss';
import logo from '~/assets/images/icon_transparent.png';
import type { LevelData } from '~/components/LevelView/types';
import LevelCard from '~/components/LevelCard';
import { levelIsSolved } from '~/components/LevelCard/helpers';
import { allLevelMetadata } from '~/components/LevelView/helpers';

export default function LevelSelect(props: {
  hideCompletedLevels?: boolean;
  levelData?: { [levelId: string]: LevelData };
  onHomeButtonClick: () => void;
  onSelectLevel: (levelId: string) => void;
}) {
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
        {allLevelMetadata
          .filter(levelMetadata => !props.hideCompletedLevels || !levelIsSolved(levelMetadata.size, props.levelData?.[levelMetadata.id]))
          .map(levelMetadata => (
            <div
              className="LevelSelect-card"
              key={levelMetadata.id}
            >
              <LevelCard
                description={levelMetadata.description}
                name={levelMetadata.name}
                onSelect={() => props.onSelectLevel(levelMetadata.id)}
                size={levelMetadata.size}
                solutionData={props.levelData?.[levelMetadata.id]}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}
