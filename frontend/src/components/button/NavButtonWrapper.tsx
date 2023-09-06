import styles from '@/styles/NavButtonWrapper.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { HomeButtonProps, ListButtonProps, PublicChannelListButtonProps, GameButtonProps } from '@/type';

const HomeButton = ({ onClickFunction }: HomeButtonProps) => {
  return (
    <button>
      <Link href="/" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image src="/assets/home-button.png" alt="home-button" onClick={onClickFunction} fill style={{ objectFit: 'contain' }} />
      </Link>
    </button>
  );
};

HomeButton.defaultProps = {
  onClickFunction: () => {
    console.error('onClickFunction is not defined');
  },
};

//TODO: mikim3에게 묻고 수정-> list와 message-channel-list의 차이점
const ListButton = ({ onClickFunction }: ListButtonProps) => {
  return (
    <button>
      <Link href="/channel/list" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image src="/assets/list-button.png" alt="list-button" onClick={onClickFunction} fill style={{ objectFit: 'contain', }} />
      </Link>
    </button>
  );
};

ListButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined'); },
};

//TODO: mikim3에게 링크 묻고 수정 -> list와 message-channel-list의 차이점
const PublicChannelListButton = ({ onClickFunction }: PublicChannelListButtonProps) => {
  return (
    <button>
      <Link href="/channel/public-channel-list" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image src="/assets/public-room-button.png" alt="public-room-button" onClick={onClickFunction} fill style={{ objectFit: 'contain' }} />
      </Link>
    </button>
  );
};

PublicChannelListButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined'); }
};

const GameButton = ({ onClickFunction }: GameButtonProps) => {
  return (
    <button>
      <Link href="/game" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image src="/assets/game-button.png" alt="game-button" onClick={onClickFunction} fill style={{ objectFit: 'contain' }} />
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