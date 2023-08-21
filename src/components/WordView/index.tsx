import './index.scss';
import { useRef, useState } from 'react';
import { latinize } from '~/ts/helpers';

export default function WordView(props: {
  hasSolvedAssociation: boolean;
  helpText?: string;
  isBonus?: boolean;
  lettersSolved: number;
  onGuess: (guess: string) => void;
  word: string;
  x: number;
  y: number;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const basePlaceholder = `${latinize(props.word)
      .replace(/[A-Za-z0-9]/g, '-')
    } (${props.word
      .split(' ')
      .filter(Boolean)
      .map(part => part.length)
      .join('+')
    })`;
  const isSolved = props.lettersSolved >= props.word.length;
  const solvedPortion = props.word.substring(0, props.lettersSolved);

  const placeholder = isSolved ? props.word
    : solvedPortion + basePlaceholder.substring(solvedPortion.length);
  const renderHelpText = props.helpText && !isSolved;

  const wordInputRef = useRef<HTMLInputElement>(null);

  if (!(isSolved || props.hasSolvedAssociation)) {
    return null;
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    props.onGuess(e.target.value);
    setFocused(false);
    setValue('');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function handleFocus() {
    setFocused(true);
    setValue(isSolved ? '' : solvedPortion);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    wordInputRef.current?.blur();
  }

  return (
    <form
      className={'WordView'
        + (props.isBonus ? ' WordView--bonus' : '')
        + (isSolved ? ' is-solved' : '')
        + (focused ? ' is-focused' : '')
      }
      onSubmit={handleSubmit}
    >
      <label
        className="WordView-label"
        style={{
          left: `${props.x}px`,
          top: `${props.y}px`
        }}
      >
        <div className="WordView-placeholder">
          {placeholder}
        </div>

        <input
          autoComplete="off"
          autoCorrect="off"
          className="WordView-input"
          name="word"
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          ref={wordInputRef}
          value={value}
        />

        {renderHelpText && !focused && (
          <div className="WordView-helpTextIndicator">
            ?
          </div>
        )}
      </label>

      {renderHelpText && focused && (
        <div className="WordView-helpText">
          {props.helpText}
        </div>
      )}
    </form>
  );
}
