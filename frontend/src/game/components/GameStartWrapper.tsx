import { useContext } from 'react';
import CatButton from '@/_components/CatButton';
import { SocketContext } from '@/context/socket';
import { GameStatus } from '@/type/gameType';
import styles from '../styles/Start.module.css';
import { socketEmitGameStartEvent } from '@/context/socketGameEvent';

const GameStartWrapper = ({ gameStatus } : { gameStatus: GameStatus }) => {
  const socket = useContext(SocketContext);
  const buttonWidth = 100;
  const buttonHeight = 80;

  return (
    <div className={styles.buttonWrapper}>
      <div className={styles.buttonOption}>
        <CatButton
          onClickFunction={() => { socketEmitGameStartEvent(gameStatus); }}
          text="rank pn"
          width={buttonWidth}
          height={buttonHeight}
        />
        <CatButton
          onClickFunction={() => { socketEmitGameStartEvent(gameStatus); }}
          text="normal pn"
          width={buttonWidth}
          height={buttonHeight}
        />
        <CatButton
          onClickFunction={() => { socketEmitGameStartEvent(gameStatus); }}
          text="rank origin"
          width={buttonWidth}
          height={buttonHeight}
        />
        <CatButton
          onClickFunction={() => { socketEmitGameStartEvent(gameStatus); }}
          text="normal origin"
          width={buttonWidth}
          height={buttonHeight}
        />
      </div>
    </div>
  );
};

export default GameStartWrapper;
