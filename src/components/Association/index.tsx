import './index.scss';

export default function Association(props: {
  word1Solved: boolean;
  word2Solved: boolean;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}) {
  const x = props.x2 - props.x1;
  const y = props.y2 - props.y1;

  return (
    <div
      className={'Association'
        + (
          props.word1Solved != props.word2Solved ? ''
            : props.word1Solved ? ' Association--solved'
            : ' Association--hidden'
          )
      }
      style={{
        left: `${props.x1}px`,
        top: `${props.y1}px`,
        transform: `rotate(${Math.atan(y / x) + (x < 0 ? Math.PI : 0)}rad)`,
        width: `${Math.sqrt(x ** 2 + y ** 2)}px`
      }}
    />
  );
}
