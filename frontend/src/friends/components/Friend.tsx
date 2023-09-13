import styles from '@/friends/styles/Friend.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FriendProps} from '@/type/friendType';

const Friend = (friendInfo: FriendProps) => {
  const redirection = `/profile/${friendInfo.nickname}`;

  let styleColor = { color : 'gray' } ;

  if (friendInfo.socketInfo.gameRoom !== '') {
    styleColor = { color: 'red' };
  } else if (friendInfo.socketInfo.online == true){
    styleColor = { color: 'green' };
  } else {
    styleColor = { color: 'gray' };
  }

  return (
    <div className={styles.friend}>
      <p>
        <span className={styles.nickname} style={styleColor}> 
          <Link href={redirection}>
            {friendInfo.nickname} 
            {styleColor.color === 'red' ? ' (게임중)' : styleColor.color === 'green' ? ' (온라인)' : ' (오프라인)' }
          </Link>
        </span>
        <Image src={friendInfo.avatar ?? '/pong-nyan.png'} alt='avatar' width={50} height={50} /> 
        <span className={styles.score}>
          <Link href='rank'> {friendInfo.rankScore}</Link> 
        </span>
      </p>
    </div>
  );
};

export default Friend;