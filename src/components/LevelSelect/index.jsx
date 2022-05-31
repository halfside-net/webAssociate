import './index.scss';
import React from 'react';
import { hot } from 'react-hot-loader';
import LevelCard from '~/components/LevelCard';

const importLevel = require.context('~/data/levels', true, /^\.\/[^\/]+\/meta\.json$/);
const levels = importLevel.keys()
  .sort()
  .map(key => Object.assign(importLevel(key), { id: key.split('/', 2)[1] }));

export default hot(module)(class LevelSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      levels,
      loading: false
    };
  }

  render() {
    return (
      <div className="LevelSelect">
        <div className="LevelSelect-list">
          {this.state.levels.map(level => (
            <div
              className="LevelSelect-card"
              key={level.id}
            >
              <LevelCard
                description={level.description}
                levelData={this.props.levelData[level.id]}
                name={level.name}
                onSelect={() => this.selectLevel(level)}
                size={level.size}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  selectLevel(level) {
    if (!this.state.loading) {
      this.setState({ loading: true });
      import(`~/data/levels/${level.id}/level.json`)
        .then(({ default: words }) => {
          this.setState({ loading: false });
          this.props.onSelectLevel({ ...level, words });
        });
    }
  }
});
