import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as CloseSVG } from '~/assets/images/close.svg';
import { ReactComponent as LevelSelectSVG } from '~/assets/images/menu_list.svg';
import { ReactComponent as PlaySVG } from '~/assets/images/play.svg';
import { ReactComponent as SettingsSVG } from '~/assets/images/settings.svg';
import Home from '~/components/Home';
import LevelView from '~/components/LevelView';
import type { LevelData } from '~/components/LevelView/types';
import LevelSelect from '~/components/LevelSelect';
import SettingsPage from '~/components/SettingsPage';
import { Settings } from '~/components/SettingsPage/types';
import { WindowResizeAdjuster } from '~/ts/WindowResizeAdjuster';
import { isAppDataV1 } from './helpers';
import type { AppDataV1 } from './types';

const appId = 'webassociate';
const windowResizeAdjuster = new WindowResizeAdjuster();

async function loadData(): Promise<AppDataV1> {
  const jsonData = window.localStorage.getItem(appId);

  if (jsonData) {
    const savedData = JSON.parse(jsonData);

    if (isAppDataV1(savedData)) {
      return savedData;
    }

    console.warn('The saved data was in an unknown format. Starting with new data instead.');
  }

  return {
    version: 1
  };
}

export default function App() {
  const [activeLevelId, setActiveLevelId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [levelsData, setLevelsData] = useState<{ [levelId: string]: LevelData }>({});
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
    const data: AppDataV1 = {
      activeLevelId,
      levelsData: levelsData,
      settings,
      version: 1
    };

    window.localStorage.setItem(appId, JSON.stringify(data));
  }

  useEffect(() => {
    loadData()
      .then(loadedData => {
        setActiveLevelId(activeLevelId || loadedData.activeLevelId || '');
        setLevelsData(loadedData.levelsData ?? levelsData);
        setSettings(loadedData.settings ?? settings);

        if (!isLoaded && loadedData.activeLevelId && !loadedData.settings?.dontResumeLevelOnLoad) {
          setViewHome(false);
          setViewLevelselect(false);
        }
      })
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      save();
    }
  }, [levelsData, settings]);

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
        {isLoaded && (activeLevelId || !viewLevelselect) &&
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
          levelData={levelsData}
          onHomeButtonClick={() => setViewHome(true)}
          onSelectLevel={levelId => {
            setActiveLevelId(levelId);
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
          key={activeLevelId}
          levelId={activeLevelId}
          onSave={data => activeLevelId && setLevelsData({ ...levelsData, [activeLevelId]: data })}
          savedData={activeLevelId ? levelsData[activeLevelId] : undefined}
        />
      </div>
    </div>
  );
}
