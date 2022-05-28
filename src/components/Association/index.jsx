import './index.scss';
import React from 'react';
import { hot } from 'react-hot-loader';

export default hot(module)(class Association extends React.Component {
  render() {
    const x = this.props.x2 - this.props.x1;
    const y = this.props.y2 - this.props.y1;

    return (
      <div
        className={'Association'
          + (
            this.props.word1Solved != this.props.word2Solved ? ''
              : this.props.word1Solved ? ' Association--solved'
              : ' Association--hidden'
            )
        }
        style={{
          left: `${this.props.x1}px`,
          top: `${this.props.y1}px`,
          transform: `rotate(${Math.atan(y / x) + (x < 0 ? Math.PI : 0)}rad)`,
          width: `${Math.sqrt(x ** 2 + y ** 2)}px`
        }}
      />
    );
  }
});
