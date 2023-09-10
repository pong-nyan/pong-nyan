import styles from '@/chat/styles/NavButtonWrapper.module.css';
import Image from 'next/image';
import Link from 'next/link';

const HomeButton = () => {
  return (
    <button style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Link href="/">
        <Image src="/assets/home-button.png" alt="home-button" fill style={{ objectFit: 'contain' }} />
      </Link>
    </button>
  );
};

//TODO: mikim3에게 묻고 수정-> list와 message-channel-list의 차이점
const ListButton = () => {
  return (
    <button style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Link href="/channel/list">
        <Image src="/assets/list-button.png" alt="list-button" fill style={{ objectFit: 'contain'}} />
      </Link>
    </button>
  );
};

//TODO: mikim3에게 링크 묻고 수정 -> list와 message-channel-list의 차이점
const PublicChannelListButton = () => {
  return (
    <button style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Link href="/channel/public-channel-list">
        <Image src="/assets/public-room-button.png" alt="public-room-button" fill style={{ objectFit: 'contain' }} />
      </Link>
    </button>
  );
};

const GameButton = () => {
  return (
    <button style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Link href="/game">
        <Image src="/assets/game-button.png" alt="game-button" fill style={{ objectFit: 'contain' }} />
      </Link>
    </button>
  );
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