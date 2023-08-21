import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as CloseSVG } from '~/assets/images/close.svg';
import { ReactComponent as LevelSelectSVG } from '~/assets/images/levelselect.svg';
import { ReactComponent as PlaySVG } from '~/assets/images/play.svg';
import { ReactComponent as SettingsSVG } from '~/assets/images/settings.svg';
import Home from '~/components/Home';
import LevelView from '~/components/LevelView';
import type { Level, LevelData } from '~/components/LevelView/types';
import LevelSelect from '~/components/LevelSelect';
import SettingsPage from '~/components/SettingsPage';
import { Settings } from '~/components/SettingsPage/types';
import { WindowResizeAdjuster } from '~/ts/WindowResizeAdjuster';
import type { SavedData } from './types';

const appId = 'webassociate';
const savedDataVersion = 1;
const windowResizeAdjuster = new WindowResizeAdjuster();

async function loadSavedData(): Promise<SavedData> {
  // TODO: Validate saved data
  return JSON.parse(window.localStorage.getItem(appId) || '{}');
}

export default function App() {
  const [activeLevelId, setActiveLevelId] = useState<string>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [level, setLevel] = useState<Level>();
  const [levelData, setLevelData] = useState<{ [levelId: string]: LevelData }>({});
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
    const data: SavedData = {
      activeLevelId,
      levelData,
      settings,
      version: savedDataVersion
    };

    window.localStorage.setItem(appId, JSON.stringify(data));
  }

  useEffect(() => {
    loadSavedData()
      .then(loadedData => {
        setLevelData(loadedData.levelData || levelData);
        setSettings(loadedData.settings || settings);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      save();
    }
  }, [levelData, settings]);

  return (
    <div
      className={'App'
        + (isLoaded ? ' is-loaded' : '')
        + (viewHome ? ' is-showing-home' : '')
        + (viewLevelselect ? ' is-showing-levelselect' : '')
        + (viewSettings ? ' is-showing-settings' : '')
      }
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      <header className="App-header">
        {isLoaded && (level || !viewLevelselect) &&
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
        {isLoaded &&
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
        }
      </header>

      <div className="App-home">
        <Home
          onPlay={isLoaded ? () => setViewHome(false) : undefined}
        />
      </div>
      <div
        className="App-levelselect"
      >
        <LevelSelect
          hideCompletedLevels={settings.hideCompletedLevels}
          levelData={levelData}
          onHomeButtonClick={() => setViewHome(true)}
          onSelectLevel={level => {
            setActiveLevelId(level?.id);
            setLevel(level);
            setViewLevelselect(false);
          }}
        />
      </div>
      <div
        className="App-settings"
      >
        <SettingsPage
          onChange={changedSettings => setSettings({ ...settings, ...changedSettings })}
          settings={settings}
        />
      </div>
      <div
        className="App-level"
      >
        <LevelView
          disableHelpText={settings.disableHelpText}
          key={level?.id || ''}
          level={level}
          onSave={data => level && setLevelData({ ...levelData, [level.id]: data })}
          savedData={level && levelData[level.id]}
        />
      </div>
    </div>
  );
}
