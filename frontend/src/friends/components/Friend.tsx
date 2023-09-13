import styles from '@/friends/styles/Friend.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FriendProps, FriendStatus} from '@/type/friendType';

const Friend = (friendInfo: FriendProps) => {
  const redirection = `/profile/${friendInfo.nickname}`;  

  let styleColor = {} ;
  switch (friendInfo.status) {
  case FriendStatus.OFFLINE:
    styleColor = {color : 'red'};
    break;
  case FriendStatus.ONLINE:
    styleColor ={color : 'gray'};
    break;
  case FriendStatus.INGAME:
    styleColor ={color : 'green'};
    break;
  }

  return (
    <div className={styles.friend}>
      <p>
        <span className={styles.nickname} style={styleColor}> 
          <Link href={redirection}>
            {friendInfo.nickname} 
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