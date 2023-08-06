import './index.scss';
import logo from '~/assets/images/logo.png';

export default function Home(props: {
  onPlay?: () => void;
}) {
  return (
    <div className="Home">
      <img
        alt="webAssociate"
        className="Home-logo"
        src={logo}
      />
      <button
        className="Home-button Home-button--play"
        onClick={props.onPlay}
      >
        Play
      </button>
    </div>
  );
}
