import styles from '@/chat/styles/MakeChannel.module.css';
import Link from 'next/link';

type PlusButtonProps = {
  alt: string;
  herf: string;
};

const PlusButton = (plusInfo : PlusButtonProps) => {

  return (
    <div className={styles.makeChannelButtonLayout} >
      <Link href={plusInfo.herf}>
        <button style={{
          width: '50px',
          height: '50px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: 0,
        }} >
          <img src='/assets/icon-plus.png' alt={plusInfo.alt} style={{
            width: '100%',
            height: '100%',
          }} />
        </button>
      </Link>
    </div>
  );
};

export default PlusButton;