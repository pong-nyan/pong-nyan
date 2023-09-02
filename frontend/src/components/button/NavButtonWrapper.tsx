import styles from '@/styles/NavButtonWrapper.module.css';

// home button
type HomeButtonProps = {
  onClickFunction: () => void;
};

const HomeButton = ({ onClickFunction}: HomeButtonProps) => {
  return (
    <button>
      <img src="/assets/home-button.png" alt="home-button" onClick={onClickFunction} />
    </button>
  );
};

HomeButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
};

// list button
type ListButtonProps = {
  onClickFunction: () => void;
};

const ListButton = ({ onClickFunction}: ListButtonProps) => {
  return (
    <button>
      <img src="/assets/list-button.png" alt="list-button" onClick={onClickFunction} />
    </button>
  );
};

ListButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
};

// publicRomm button
type PublicRoomButtonProps = {
  onClickFunction: () => void;
};

const PublicRoomButton = ({ onClickFunction }: PublicRoomButtonProps) => {
  return (
    <button>
      <img src="/assets/public-room-button.png" alt="public-room-button" onClick={onClickFunction}  />
    </button>
  );
};

PublicRoomButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
};

// game button
type GameButtonProps = {
  onClickFunction: () => void;
};

const GameButton = ({ onClickFunction}: GameButtonProps) => {
  return (
    <button>
      <img src="/assets/game-button.png" alt="game-button" onClick={onClickFunction} />
    </button>
  );
};

GameButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
};

const NavButtonWrapper= () => {
  return (
    <nav className={styles.navButtonWrapper}>{/* 하단 네비게이션 최상위 태그 */}
      <HomeButton />
      <ListButton />
      <PublicRoomButton />
      <GameButton />
    </nav>
  );
};

export default NavButtonWrapper;