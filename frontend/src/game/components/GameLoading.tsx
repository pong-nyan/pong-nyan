
import styles from '@/game/styles/start.module.css'

const GameLoading= () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}/>
      <div className={styles.paragraphContainer}>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default GameLoading;
