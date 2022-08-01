import './index.scss';
import React from 'react';
import { hot } from 'react-hot-loader';
import { ReactComponent as LevelSelectSVG } from '~/assets/images/levelselect.svg';
import logo from '~/assets/images/logo.png';
import { ReactComponent as SettingsSVG } from '~/assets/images/settings.svg';
import Home from '~/components/Home';
import Level from '~/components/Level';
import LevelSelect from '~/components/LevelSelect';
import { WindowResizeAdjuster } from '~/js/WindowResizeAdjuster.js';

export default hot(module)(class App extends React.Component {
  constructor(props) {
    super(props);

    this.hasFocus = false;
    this.id = 'webassociate';
    this.state = {
      level: null,
      viewHome: true,
      viewLevelselect: true,
      viewSettings: false
    };
    this.windowResizeAdjuster = new WindowResizeAdjuster();

    this.engageWindowResizeAdjuster = () => {
      if (!this.windowResizeAdjuster.running) {
        this.windowResizeAdjuster.engage(100);
      }
    };

    this.loadSavedData();
  }

  handleBlur(e) {
    this.hasFocus = false;
    window.requestAnimationFrame(() => {
      if (!this.hasFocus) {
        window.removeEventListener('resize', this.engageWindowResizeAdjuster);
        this.windowResizeAdjuster.reset();
      }
    });
  }

  handleFocus(e) {
    this.hasFocus = true;
    this.engageWindowResizeAdjuster();
    window.addEventListener('resize', this.engageWindowResizeAdjuster);
  }

  loadSavedData() {
    this.savedData = {
      levels: {},
      settings: {},
      ...JSON.parse(window.localStorage.getItem(this.id) || '{}')
    };
  }

  render() {
    return (
      <div
        className={'App'
          + (this.state.viewHome ? ' is-showing-home' : '')
          + (this.state.viewLevelselect ? ' is-showing-levelselect' : '')
          + (this.state.viewSettings ? ' is-showing-settings' : '')
        }
        onBlur={e => this.handleBlur(e)}
        onFocus={e => this.handleFocus(e)}
      >
        <header className="App-header">
          <button
            className="App-levelselectButton"
            onClick={() => this.setState(state => ({ viewLevelselect: !state.viewLevelselect }))}
          >
            <LevelSelectSVG />
          </button>
          <button
            className="App-homeButton"
            onClick={() => this.setState({ viewHome: true })}
          >
            <img
              alt="webAssociate"
              className="App-homeButtonIcon"
              src={logo}
            />
          </button>
          <button
            className="App-settingsButton"
            onClick={() => this.setState(state => ({ viewSettings: !state.viewSettings }))}
          >
            <SettingsSVG />
          </button>
        </header>

        <div className="App-home">
          <Home onPlay={() => this.setState({ viewHome: false })} />
        </div>
        <div className="App-levelselect">
          <LevelSelect
            levelData={this.savedData.levels}
            onSelectLevel={level => this.setState({ level, viewLevelselect: false })}
          />
        </div>
        <div className="App-settings">
          // TODO
          Settings
        </div>
        <div className="App-level">
          <Level
            key={(this.state.level || {}).id || ''}
            level={this.state.level}
            onSave={data => this.saveLevel(this.state.level.id, data)}
            savedData={this.state.level && this.savedData.levels[this.state.level.id]}
          />
        </div>
      </div>
    );
  }

  save() {
    window.localStorage.setItem(this.id, JSON.stringify(this.savedData));
  }

  saveLevel(levelId, data) {
    this.savedData.levels[levelId] = data;
    this.save();
  }
});
