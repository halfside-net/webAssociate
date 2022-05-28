import './index.scss';
import React from 'react';
import { hot } from 'react-hot-loader';
import { latinize } from '~/js/helpers.js';

export default hot(module)(class Word extends React.Component {
  constructor(props) {
    super(props);

    this.basePlaceholder = `${
      latinize(props.word)
        .replace(/[A-Za-z0-9]/g, '-')
      } (${
        props.word
          .split(' ')
          .filter(Boolean)
          .map(part => part.length)
          .join('+')
      })`;
    this.state = {
      focused: false,
      value: ''
    };
  }

  getPlaceholder() {
    const solvedPortion = this.getSolvedPortion();

    return this.isSolved() ? this.props.word
      : solvedPortion + this.basePlaceholder.substring(solvedPortion.length)
  }

  getSolvedPortion() {
    return this.props.word.substring(0, this.props.lettersSolved);
  }

  handleBlur(e) {
    this.props.onGuess(e.target.value);
    this.setState({
      focused: false,
      value: ''
    });
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleFocus(e) {
    const value = this.isSolved() ? '' : this.getSolvedPortion();

    this.setState({
      focused: true,
      value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.target.word.blur();
  }

  isSolved() {
    return this.props.lettersSolved >= this.props.word.length;
  }

  render() {
    const renderHelpText = this.props.helpText && !this.isSolved();

    return (
      <form
        className={'Word'
          + (this.props.isBonus ? ' Word--bonus' : '')
          + (
            this.isSolved() ? ' is-solved'
              : this.props.hasSolvedAssociation ? ''
              : ' is-hidden'
            )
          + (this.state.focused ? ' is-focused' : '')
        }
        onSubmit={e => this.handleSubmit(e)}
      >
        <label
          className="Word-label"
          style={{
            left: `${this.props.x}px`,
            top: `${this.props.y}px`
          }}
        >
          <div className="Word-placeholder">
            {this.getPlaceholder()}
          </div>

          <input
            autoComplete="off"
            autoCorrect="off"
            className="Word-input"
            name="word"
            onBlur={e => this.handleBlur(e)}
            onChange={e => this.handleChange(e)}
            onFocus={e => this.handleFocus(e)}
            value={this.state.value}
          />

          {renderHelpText && (
            <div className="Word-helpTextIndicator">
              ?
            </div>
          )}
        </label>

        {renderHelpText && (
          <div className="Word-helpText">
            {this.props.helpText}
          </div>
        )}
      </form>
    );
  }
});
