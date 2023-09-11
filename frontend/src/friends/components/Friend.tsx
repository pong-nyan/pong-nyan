import styles from '@/friends/styles/Friend.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FriendProps, FriendStatus } from '@/type/friendType';

const Friend = (friendInfo: FriendProps) => {
  const redirection = `/profile/${friendInfo.nickname}`;  

  // let styleColor ;
  // switch (friend.status) {
  // case FriendStatus.OFFLINE:
  //   styleColor = {color : 'gray'};
  //   break;
  // case FriendStatus.ONLINE:
  //   styleColor ={color : 'green'};
  //   break;
  // case FriendStatus.INGAME:
  //   styleColor ={color : 'yellow'};
  //   break;
  // }

  return (
    <div className={styles.friend}>
      <p>
        {/* <span className={styles.nickname} style={styleColor}>  */}
        <span className={styles.nickname} > 
          <Link href={redirection}>
            {friendInfo.nickname} 
          </Link>
        </span>
        <Image src={friendInfo.avatar ?? 'pong-nyan.png'} alt='avatar' width={50} height={50} /> 
        <span className={styles.score}> 
          <Link href='rank'> {friendInfo.rankScore}</Link> 
        </span>
      </p>
    </div>
  );
};

export default Friend;