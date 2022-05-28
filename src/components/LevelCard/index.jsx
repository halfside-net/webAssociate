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
    return (
      <div
        className={'LevelCard'
          + (this.props.progress >= 1 ? ' is-complete' : '')
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
                height: `${Math.max(0, 1 - this.props.progress) * 100}%`
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
          <div className="LevelCard-size">
            Level Size: {this.props.size}
          </div>
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
