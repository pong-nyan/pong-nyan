import Image from 'next/image';

// home button
type HomeButtonProps = {
  onClickFunction: () => void;
  width: number;
  height: number;
};

const HomeButton = ({ onClickFunction, width, height }: HomeButtonProps) => {
  return (
    <button>
      <Image src="/assets/home-button.png" alt="home-button" onClick={onClickFunction} width={width ?? 42} height={height ?? 42} />
    </button>
  );
};

HomeButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
  width: 42,
  height: 42,
};

// list button
type ListButtonProps = {
  onClickFunction: () => void;
  width: number;
  height: number;
};

const ListButton = ({ onClickFunction, width, height }: ListButtonProps) => {
  return (
    <button>
      <Image src="/assets/list-button.png" alt="list-button" onClick={onClickFunction} width={width ?? 42} height={height ?? 42} />
    </button>
  );
};

ListButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
  width: 42,
  height: 42,
};

// publicRomm button
type PublicRoomButtonProps = {
  onClickFunction: () => void;
  width: number;
  height: number;
};

const PublicRoomButton = ({ onClickFunction, width, height }: PublicRoomButtonProps) => {
  return (
    <button>
      <Image src="/assets/public-room-button.png" alt="public-room-button" onClick={onClickFunction} width={width ?? 42} height={height ?? 42} />
    </button>
  );
};

PublicRoomButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
  width: 42,
  height: 42,
};

// game button
type GameButtonProps = {
  onClickFunction: () => void;
  width: number;
  height: number;
};

const GameButton = ({ onClickFunction, width, height }: GameButtonProps) => {
  return (
    <button>
      <Image src="/assets/game-button.png" alt="game-button" onClick={onClickFunction} width={width ?? 42} height={height ?? 42} />
    </button>
  );
};

GameButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
  width: 42,
  height: 42,
};

const NavButtonWrapper= () => {
  return (
    <nav style={{display:'flex'}} className="NavButtonWrapper">{/* 하단 네비게이션 최상위 태그 */}
      <HomeButton />
      <div>button2</div>
      <div>button3</div>
      <div>button4</div>
      <div>button5</div>
    </nav>
  );
};

export default NavButtonWrapper;