import Link from 'next/link';
import styles from '@/styles/FeatureLinkList.module.css';

const FeatureLinkList = () => {
  const features = [{ id: 1, name: 'Rank', path: '/rank' },
    { id: 2, name: 'Game', path: '/game' },
    { id: 3, name: 'Chat', path: '/channel/list' },  
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