import styles from '@/styles/NavButtonWrapper.module.css';
import Link from 'next/link';

// home button
type HomeButtonProps = {
  onClickFunction: () => void;
};

const HomeButton = ({ onClickFunction }: HomeButtonProps) => {
  return (
    <button>
      <Link href="/">
        <img src="/assets/home-button.png" alt="home-button" onClick={onClickFunction} />
      </Link>
    </button>
  );
};

HomeButton.defaultProps = {
  onClickFunction: () => {
    console.error('onClickFunction is not defined');
  },
};

// list button
type ListButtonProps = {
  onClickFunction: () => void;
};

//TODO: mikim3에게 묻고 수정-> list와 message-channel-list의 차이점
const ListButton = ({ onClickFunction }: ListButtonProps) => {
  return (
    <button>
      <Link href="/channel/list">
        <img src="/assets/list-button.png" alt="list-button" onClick={onClickFunction} />
      </Link>
    </button>
  );
};

ListButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined'); },
};

// publicRomm button
type PublicChannelListButtonProps = {
  onClickFunction: () => void;
};

//TODO: mikim3에게 링크 묻고 수정 -> list와 message-channel-list의 차이점
const PublicChannelListButton = ({ onClickFunction }: PublicChannelListButtonProps) => {
  return (
    <button>
      <Link href="/channel/public-channel-list">
        <img src="/assets/public-room-button.png" alt="public-room-button" onClick={onClickFunction} />
      </Link>
    </button>
  );
};

PublicChannelListButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined'); }
};

// game button
type GameButtonProps = {
  onClickFunction: () => void;
};

const GameButton = ({ onClickFunction }: GameButtonProps) => {
  return (
    <button>
      <Link href="/game">
        <img src="/assets/game-button.png" alt="game-button" onClick={onClickFunction} />
      </Link>
    </button>
  );
};

GameButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined'); },
};

const NavButtonWrapper = () => {
  return (
    <nav className={styles.navButtonWrapper}>{/* 하단 네비게이션 최상위 태그 */}
      <HomeButton />
      <ListButton />
      <PublicChannelListButton />
      <GameButton />
    </nav>
  );
};

export default NavButtonWrapper;