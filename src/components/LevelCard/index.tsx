import './index.scss';
import { useState } from 'react';
import type { LevelData } from '~/components/Game/types';
import { getLevelProgress } from './helpers';

export default function LevelCard(props: {
  description?: string;
  name: string;
  onSelect?: () => void;
  size: number;
  solutionData?: LevelData;
}) {
  const [expanded, setExpanded] = useState(false);

  const progress = getLevelProgress(props.size, props.solutionData);

  function toggleDetails() {
    setExpanded(!expanded);
  }

  return (
    <div
      className={'LevelCard'
        + (progress < 1 ? '' : ' is-complete')
        + (expanded ? ' is-expanded' : '')
      }
    >
      <button
        className="LevelCard-button"
        onClick={props.onSelect}
      >
        <span className="LevelCard-progressBar">
          <span
            className="LevelCard-progressIndicator"
            style={{
              backgroundSize: `100% ${(1 - progress) * 100}%`
            }}
          />
        </span>
        <span className="LevelCard-title">
          {props.name}
        </span>
      </button>
      <button
        aria-label={(expanded ? 'Hide' : 'Show') + ' details for level "' + props.name + '"'}
        className="LevelCard-toggleBtn"
        onClick={toggleDetails}
      />
      {expanded && (
        <div className="LevelCard-info">
          {props.size ? (
            <div className="LevelCard-size">
              Level Size: {
                props.size < 900 ? 'Small'
                  : props.size < 1200 ? 'Medium'
                    : props.size < 1500 ? 'Large'
                      : 'Giant'
              }
            </div>
          ) : ''}
          {props.description ? (
            <div className="LevelCard-description">
              {props.description}
            </div>
          ) : ''}
        </div>
      )}
    </div>
  );
}
