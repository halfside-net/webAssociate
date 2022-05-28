import './index.scss';
import React from 'react';
import { hot } from 'react-hot-loader';
import logo from '~/assets/images/logo.png';

export default hot(module)(class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <img
          alt="webAssociate"
          className="Home-logo"
          src={logo}
        />
        <button
          className="Home-button Home-button--play"
          onClick={this.props.onViewLevelSelect}
        >
          Play
        </button>
      </div>
    );
  }
});
