import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as CloseSVG } from '~/assets/images/close.svg';
import { ReactComponent as LevelSelectSVG } from '~/assets/images/levelselect.svg';
import { ReactComponent as PlaySVG } from '~/assets/images/play.svg';
import { ReactComponent as SettingsSVG } from '~/assets/images/settings.svg';
import Home from '~/components/Home';
import Level from '~/components/Level';
import type { LevelData, LevelSolutionData } from '~/components/Level/types';
import LevelSelect from '~/components/LevelSelect';
import SettingsPage from '~/components/SettingsPage';
import { Settings } from '~/components/SettingsPage/types';
import { WindowResizeAdjuster } from '~/ts/WindowResizeAdjuster';
import type { SavedData } from './types';

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
  const [settings, setSettings] = useState<Settings>({});
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

  function saveSettings(newSettings: Settings) {
    if (savedDataRef.current) {
      savedDataRef.current.settings = newSettings;
      save();
    }
  }

  useEffect(() => {
    savedDataRef.current ??= loadSavedData();
  }, []);

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
        {(level || !viewLevelselect) &&
          <button
            aria-label={viewLevelselect ? 'Resume level' : 'Select level'}
            className="App-levelselectButton"
            onClick={() => setViewLevelselect(!viewLevelselect)}
          >
            {viewLevelselect ?
              <PlaySVG
                className="App-levelselectButtonIcon"
              />
            :
              <LevelSelectSVG
                className="App-levelselectButtonIcon"
              />
            }
          </button>
        }
        <button
          aria-label={viewSettings ? 'Close settings' : 'Settings'}
          className="App-settingsButton"
          onClick={() => setViewSettings(!viewSettings)}
        >
          {viewSettings ?
            <CloseSVG
              className="App-settingsButtonIcon"
            />
          :
            <SettingsSVG
              className="App-settingsButtonIcon"
            />
          }
        </button>
      </header>

      <div className="App-home">
        <Home onPlay={() => setViewHome(false)} />
      </div>
      <div
        className="App-levelselect"
      >
        <LevelSelect
          levelData={savedDataRef.current?.levels}
          onHomeButtonClick={() => setViewHome(true)}
          onSelectLevel={level => {
            setLevel(level);
            setViewLevelselect(false);
          }}
        />
      </div>
      <div
        className="App-settings"
      >
        <SettingsPage />
      </div>
      <div
        className="App-level"
      >
        <Level
          disableHelpText={settings.disableHelpText}
          key={level?.id || ''}
          level={level}
          onSave={data => level && saveLevel(level.id, data)}
          savedData={level && savedDataRef.current?.levels[level.id]}
        />
      </div>
    </div>
  );
}
