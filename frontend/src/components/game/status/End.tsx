import { Dispatch, SetStateAction } from 'react';
import styles from '../../../styles/End.module.css';

export default function End({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  return (
    <div className={styles.buttonWrapper}>
      <button className={styles.endButton} onClick={() => setGameStatus(0)} >End</button>
    </div>
  );
}