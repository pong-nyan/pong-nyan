import Link from 'next/link';
import styles from '@/styles/FeatureLinkList.module.css';
import { useEffect, useState } from 'react';

type userInfoProps = {
  nickname: string;
  intraId: string;
};

const FeatureLinkList = () => {
  const [UserInfo, setUserInfo] = useState<userInfoProps>({nickname:'', intraId:''});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserInfo({nickname : user.nickname, intraId : user.intraId});
  }, []);

  const features = [
    { id: 1, name: 'Chat', path: '/chat/list' },
    { id: 2, name: 'Game', path: '/game' },
    { id: 3, name: 'friends', path: '/friends/' + UserInfo.intraId },
    { id: 4, name: 'Profile', path: '/profile/' + UserInfo.nickname },
    { id: 5, name: 'Rank', path: '/rank' },
  ];

  return (
    <div className={styles.container}>
      <ul className={styles.linkList}>
        {features.map(feature => (
          <Link className={styles.linkItem} href={feature.path} key={feature.id}>
            <div>
              {feature.name}
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default FeatureLinkList;