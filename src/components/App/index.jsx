import './index.scss';
import React from 'react';
import { hot } from 'react-hot-loader';
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
      view: 'home'
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
        className="App"
        onBlur={e => this.handleBlur(e)}
        onFocus={e => this.handleFocus(e)}
      >
        <header className="App-header">
          {this.renderBackButton()}
        </header>
        <div className="App-content">
          {this.renderCurrentView()}
        </div>
      </div>
    );
  }

  renderBackButton() {
    switch (this.state.view) {
      case 'level':
        return (
          <button className="App-backButton" onClick={() => this.viewLevelSelect()}>
            &lt; Back to level selection
          </button>
        );
      case 'levelselect':
        return (
          <button className="App-backButton" onClick={() => this.viewHome()}>
            &lt; Back home
          </button>
        );
      default:
        return;
    }
  }

  renderCurrentView() {
    switch (this.state.view) {
      case 'level':
        return (
          <Level
            level={this.state.level}
            onSave={data => this.saveLevel(this.state.level.id, data)}
            savedData={this.savedData.levels[this.state.level.id]}
          />
        );
      case 'levelselect':
        return (
          <LevelSelect
            levelData={this.savedData.levels}
            onSelectLevel={level => this.viewLevel(level)}
          />
        );
      default:
        return (
          <Home onViewLevelSelect={() => this.viewLevelSelect()} />
        );
    }
  }

  save() {
    window.localStorage.setItem(this.id, JSON.stringify(this.savedData));
  }

  saveLevel(levelId, data) {
    this.savedData.levels[levelId] = data;
    this.save();
  }

  viewHome() {
    this.setState({
      view: 'home'
    });
  }

  viewLevel(level = this.state.level) {
    this.setState({
      level,
      view: 'level'
    });
  }

  viewLevelSelect() {
    this.setState({
      view: 'levelselect'
    });
  }
});
