import './index.scss';
import React from 'react';
import { hot } from 'react-hot-loader';
import Association from '~/components/Association';
import Word from '~/components/Word';
import { normalizeText } from '~/js/helpers.js';

export default hot(module)(class Level extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.fromEntries(
      Object.entries(props.level.words)
        .map(([wordId, wordData]) => [
          wordId,
          wordData.isStartup ? wordData.word
            : this.getCorrectSubstring(wordId, (this.props.savedData || {})[wordId] || '')
        ])
    );
  }

  getCorrectSubstring(wordId, guess) {
    const wordData = this.props.level.words[wordId];
    const normalizedGuess = normalizeText(guess);
    let lettersSolved = 0;

    if ([wordData.word]
      .concat(wordData.alternativeWords || [])
      .some(word => normalizedGuess.startsWith(normalizeText(word))) // TODO: Allow for some typos
    ) {
      lettersSolved = wordData.word.length;
    } else if (!wordData.isBonus) {
      for (let guessPosition = 0; lettersSolved < wordData.word.length && guessPosition < normalizedGuess.length; lettersSolved++) {
        const normalizedChar = normalizeText(wordData.word[lettersSolved]);

        if (normalizedChar && normalizedGuess[guessPosition++] != normalizedChar) {
          break;
        }
      }
    }

    return wordData.word.substring(0, lettersSolved);
  }

  getWordCurrentSolution(wordId) {
    return this.state[wordId] || '';
  }

  guessWord(wordId, guess) {
    const wordData = this.props.level.words[wordId];

    if (this.wordIsSolved(wordId)) {
      (wordData.associations || [])
        .filter(otherWordId => !this.wordIsSolved(otherWordId))
        .forEach(otherWordId => this.guessWord(otherWordId, guess));
    } else {
      const correctSubstring = this.getCorrectSubstring(wordId, guess);

      if (correctSubstring.length > this.getWordCurrentSolution(wordId).length) {
        this.setState({ [wordId]: correctSubstring }, () => this.save());
      }
    }
  }

  render() {
    const wordEntries = Object.entries(this.props.level.words)
      .sort(([idA, dataA], [idB, dataB]) => dataA.y - dataB.y || dataA.x - dataB.x);

    return (
      <div className="Level">
        <div
          className="Level-container"
          style={{
            height: `${this.props.level.height}px`,
            width: `${this.props.level.width}px`
          }}
        >
          {wordEntries.map(([wordId, wordData]) =>
            (wordData.associations || [])
              .filter(otherWordId => wordId < otherWordId)
              .map(otherWordId => (
                <Association
                  key={JSON.stringify([wordId, otherWordId])}
                  word1Solved={this.wordIsSolved(wordId)}
                  word2Solved={this.wordIsSolved(otherWordId)}
                  x1={wordData.x}
                  x2={this.props.level.words[otherWordId].x}
                  y1={wordData.y}
                  y2={this.props.level.words[otherWordId].y}
                />
              ))
          )}
          {wordEntries.map(([wordId, wordData]) => (
            <Word
              hasSolvedAssociation={(wordData.associations || []).some(otherWordId => this.wordIsSolved(otherWordId))}
              helpText={wordData.helpText}
              isBonus={wordData.isBonus}
              key={wordId}
              lettersSolved={this.getWordCurrentSolution(wordId).length}
              onGuess={guess => this.guessWord(wordId, guess)}
              word={wordData.word}
              x={wordData.x}
              y={wordData.y}
            />
          ))}
        </div>
      </div>
    );
  }

  save() {
    this.props.onSave(Object.fromEntries(
      Object.entries(this.state)
        .filter(([id, solution]) => solution && !this.props.level.words[id].isStartup)
    ));
  }

  wordIsSolved(wordId) {
    return this.getWordCurrentSolution(wordId).length >= this.props.level.words[wordId].word.length;
  }
});
