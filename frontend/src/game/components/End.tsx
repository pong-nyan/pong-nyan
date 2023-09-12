import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import styles from '@/game/styles/End.module.css';
import { Nickname } from '@/type/userType';
import { Score } from '@/type/gameType';

const End = ({ setGameStatus, score, setScore, nickname }: { 
  setGameStatus: Dispatch<SetStateAction<number>>,
  score: { p1: Score, p2: Score }
  setScore: Dispatch<SetStateAction<{ p1: Score, p2: Score }>>
  nickname: { p1: Nickname, p2: Nickname },
  }) => {
  const winner = score.p1 > score.p2 ? 'p1' : 'p2';
  const router = useRouter();

  return (
    <div className={styles.endPage}>
      <div className={styles.scoreBoardMargin} />
      <div className={styles.scoreBoardContainer}>
        <div className={styles.scoreBoardHeader}>
          <span className={styles.playerNickname1}>{nickname.p1}</span>
          <span className={styles.playerNickname2}>{nickname.p2}</span>
        </div>
        <div className={styles.scoreBoardContent}>
          <div className={styles.playerScore}>
            <span>{score.p1}</span>
            <div className={winner === 'p1' ? styles.winner : styles.loser}>
              {winner === 'p1' ? 'Winner' : 'Loser'}
            </div>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.playerScore}>
            <span>{score.p2}</span>
            <div className={winner === 'p2' ? styles.winner : styles.loser}>
              {winner === 'p2' ? 'Winner' : 'Loser'}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <div className={styles.buttonGroup}>
          <button className={styles.mainButton} onClick={() => {
            router.push('/')
            setScore({ p1: 0, p2: 0 })
          }}>
            Main
          </button>
          <button className={styles.restartButton} onClick={() => {
            setGameStatus(0)
            setScore({ p1: 0, p2: 0 })
          }}>
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}

export default End;
