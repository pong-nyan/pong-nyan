import styles from '@/friends/styles/Friend.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FriendProps} from '@/type/friendType';
import useAuth from '@/context/useAuth';

const Friend = (friendInfo: FriendProps) => {
  useAuth();
  const redirection = `/profile/${friendInfo.nickname}`;
  
  console.log(friendInfo.socketInfo);
  let styleColor = { color : 'gray' } ;
  if (!friendInfo.socketInfo || !friendInfo.socketInfo.online ) {
    styleColor = { color: 'gray' };
  } else if (friendInfo.socketInfo.gameRoom !== '') {
    styleColor = { color: 'red' };
  } else {
    styleColor = { color: 'green' };
  }

  return (
    <div className={styles.friend}>
      <p>
        <span className={styles.nickname} style={styleColor}> 
          <Link href={redirection}>
            {friendInfo.nickname} 
            {styleColor.color === 'red' ? ' (게임중) ' : styleColor.color === 'green' ? ' (온라인) ' : ' (오프라인) ' }
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