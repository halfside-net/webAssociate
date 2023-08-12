import './index.scss';
import { useEffect, useState } from 'react';
import Association from '~/components/Association';
import type { WordData } from '~/components/Word/types';
import Word from '~/components/Word';
import { normalizeText } from '~/ts/helpers';
import type { LevelData, LevelSolutionData } from './types';

function getCorrectSubstring(wordData: WordData, guess: string) {
  const normalizedGuess = normalizeText(guess);
  let lettersSolved = 0;

  if ([wordData.word]
    .concat(wordData.alternativeWords ?? [])
    .some(word => normalizedGuess.startsWith(normalizeText(word))) // TODO: Allow for some typos in full-word guesses
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

export default function Level(props: {
  level?: LevelData;
  onSave: (savedData: LevelSolutionData) => void;
  savedData?: LevelSolutionData;
}) {
  const words = props.level?.words ?? {};

  const wordEntries = Object.entries(words)
    .sort(([, dataA], [, dataB]) => dataA.y - dataB.y || dataA.x - dataB.x);

  const [levelState, setLevelState] = useState(Object.fromEntries(
    wordEntries.map(([wordId, wordData]) => [
      wordId,
      wordData.isStartup ? wordData.word
        : getCorrectSubstring(wordData, props.savedData?.[wordId] ?? '')
    ])
  ));

  const levelStateValues = Object.entries(levelState)
    .sort(([idA], [idB]) => idA < idB ? -1 : 1)
    .map(([, wordState]) => wordState);

  function guessWord(wordId: string, guess: string) {
    const wordData = words[wordId];

    if (wordIsSolved(wordId)) {
      (wordData.associations ?? [])
        .filter(otherWordId => !wordIsSolved(otherWordId))
        .forEach(otherWordId => guessWord(otherWordId, guess));
    } else {
      const correctSubstring = getCorrectSubstring(wordData, guess);

      setLevelState(state => correctSubstring > (state[wordId] ?? '') ? {
        ...state,
        [wordId]: correctSubstring
      } : state);
    }
  }

  function save() {
    props.onSave(Object.fromEntries(
      Object.entries(levelState)
        .filter(([id, solution]) => solution && !words[id].isStartup)
    ));
  }

  function wordIsSolved(wordId: string) {
    return levelState[wordId].length >= words[wordId].word.length;
  }

  // Save if the level or any of the word states changed
  useEffect(save, [props.level?.id, ...levelStateValues]);

  return (
    <div className="Level">
      <div
        className="Level-container"
        style={{
          height: `${props.level?.height ?? 0}px`,
          width: `${props.level?.width ?? 0}px`
        }}
      >
        {wordEntries.map(([wordId, wordData]) =>
          (wordData.associations ?? [])
            .filter(otherWordId => wordId < otherWordId)
            .map(otherWordId => (
              <Association
                key={JSON.stringify([wordId, otherWordId])}
                word1Solved={wordIsSolved(wordId)}
                word2Solved={wordIsSolved(otherWordId)}
                x1={wordData.x}
                x2={words[otherWordId].x}
                y1={wordData.y}
                y2={words[otherWordId].y}
              />
            ))
        )}
        {wordEntries.map(([wordId, wordData]) => (
          <Word
            hasSolvedAssociation={(wordData.associations ?? []).some(otherWordId => wordIsSolved(otherWordId))}
            helpText={wordData.helpText}
            isBonus={wordData.isBonus}
            key={wordId}
            lettersSolved={levelState[wordId].length}
            onGuess={guess => guessWord(wordId, guess)}
            word={wordData.word}
            x={wordData.x}
            y={wordData.y}
          />
        ))}
      </div>
    </div>
  );
}
