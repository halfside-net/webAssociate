import './index.scss';
import React from 'react';
import { hot } from 'react-hot-loader';

export default hot(module)(class LevelSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  render() {
    const lettersSolved = Object.values(this.props.levelData || {})
      .reduce((total, solution) => total + solution.length, 0);
    const progress = this.props.size ? Math.min(lettersSolved / this.props.size, 1) : 0;

    return (
      <div
        className={'LevelCard'
          + (progress < 1 ? '' : ' is-complete')
          + (this.state.expanded ? ' is-expanded' : '')
        }
      >
        <button
          className="LevelCard-button"
          onClick={this.props.onSelect}
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
            {this.props.name}
          </span>
        </button>
        <button
          className="LevelCard-toggleBtn"
          onClick={() => this.toggleDetails()}
        />
        <div className="LevelCard-info">
          {this.props.size ? (
            <div className="LevelCard-size">
              Level Size: {
                this.props.size < 900 ? 'Small'
                : this.props.size < 1200 ? 'Medium'
                : this.props.size < 1500 ? 'Large'
                : 'Giant'
              }
            </div>
          ) : ''}
          {this.props.description ? (
            <div className="LevelCard-description">
              {this.props.description}
            </div>
          ) : ''}
        </div>
      </div>
    );
  }

  toggleDetails() {
    this.setState({ expanded: !this.state.expanded });
  }
});
