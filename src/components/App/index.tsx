import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as LevelSelectSVG } from '~/assets/images/levelselect.svg';
import logo from '~/assets/images/logo.png';
import { ReactComponent as SettingsSVG } from '~/assets/images/settings.svg';
import Home from '~/components/Home';
import Level from '~/components/Level';
import { LevelData, LevelSolutionData } from '~/components/Level/types';
import LevelSelect from '~/components/LevelSelect';
import { WindowResizeAdjuster } from '~/ts/WindowResizeAdjuster';
import { SavedData } from './types';

const appId = 'webassociate';
const windowResizeAdjuster = new WindowResizeAdjuster();

function loadSavedData(): SavedData {
  return {
    levels: {},
    settings: {},
    ...JSON.parse(window.localStorage.getItem(appId) || '{}')
  };
}

export default function App() {
  const [level, setLevel] = useState<LevelData>();
  const [viewHome, setViewHome] = useState(true);
  const [viewLevelselect, setViewLevelselect] = useState(true);
  const [viewSettings, setViewSettings] = useState(false);

  const engageWindowResizeAdjusterRef = useRef(() => {
    if (!windowResizeAdjuster.running) {
      windowResizeAdjuster.engage(100);
    }
  });
  const hasFocusRef = useRef(false);
  const savedDataRef = useRef<SavedData>();

  function handleBlur() {
    hasFocusRef.current = false;
    window.requestAnimationFrame(() => {
      if (!hasFocusRef.current) {
        window.removeEventListener('resize', engageWindowResizeAdjusterRef.current);
        windowResizeAdjuster.reset();
      }
    });
  }

  function handleFocus() {
    hasFocusRef.current = true;
    engageWindowResizeAdjusterRef.current();
    window.addEventListener('resize', engageWindowResizeAdjusterRef.current);
  }

  function save() {
    window.localStorage.setItem(appId, JSON.stringify(savedDataRef.current));
  }

  function saveLevel(levelId: string, data: LevelSolutionData) {
    if (savedDataRef.current) {
      savedDataRef.current.levels[levelId] = data;
      save();
    }
  }

  useEffect(() => {
    savedDataRef.current ??= loadSavedData();
  });

  return (
    <div
      className={'App'
        + (viewHome ? ' is-showing-home' : '')
        + (viewLevelselect ? ' is-showing-levelselect' : '')
        + (viewSettings ? ' is-showing-settings' : '')
      }
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      <header className="App-header">
        <button
          aria-label="Select level"
          className="App-levelselectButton"
          onClick={() => setViewLevelselect(!viewLevelselect)}
        >
          <LevelSelectSVG />
        </button>
        <button
          aria-label="Home"
          className="App-homeButton"
          onClick={() => setViewHome(true)}
        >
          <img
            alt="webAssociate"
            className="App-homeButtonIcon"
            src={logo}
          />
        </button>
        <button
          aria-label="Settings"
          className="App-settingsButton"
          onClick={() => setViewSettings(!viewSettings)}
        >
          <SettingsSVG />
        </button>
      </header>

      <div className="App-home">
        <Home onPlay={() => setViewHome(false)} />
      </div>
      <div className="App-levelselect">
        <LevelSelect
          levelData={savedDataRef.current?.levels}
          onSelectLevel={level => {
            setLevel(level);
            setViewLevelselect(false);
          }}
        />
      </div>
      <div className="App-settings">
        // TODO
        Settings
      </div>
      <div className="App-level">
        <Level
          key={level?.id || ''}
          level={level}
          onSave={data => level && saveLevel(level.id, data)}
          savedData={level && savedDataRef.current?.levels[level.id]}
        />
      </div>
    </div>
  );
}
