import { Dispatch, SetStateAction } from 'react';
import { PlayerNumber } from '../gameType';
import styles from '@/game/styles/End.module.css';

export default function End({ setGameStatus, setPlayerNumber }: { setGameStatus: Dispatch<SetStateAction<number>>, setPlayerNumber: Dispatch<SetStateAction<PlayerNumber | undefined>> }) {
  return (
    <div className={styles.buttonWrapper}>
      <button className={styles.endButton} onClick={() => setGameStatus(0)} >End</button>
    </div>
  );
}