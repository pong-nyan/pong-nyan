import { useContext } from 'react';
import CatButton from '@/_components/CatButton';
import { SocketContext } from '@/context/socket';
import styles from '../styles/Start.module.css';

const GameStartWrapper = () => {
  const socket = useContext(SocketContext);
  const buttonWidth = 100;
  const buttonHeight = 80;

  return (
    <div className={styles.buttonWrapper}>
      <div className={styles.buttonOption}>
        <CatButton
          onClickFunction={() => {
            socket.emit('game-randomStart');
          }}
          text="rank pn"
          width={buttonWidth}
          height={buttonHeight}
        />
        <CatButton
          onClickFunction={() => {
            socket.emit('game-loading');
          }}
          text="normal pn"
          width={buttonWidth}
          height={buttonHeight}
        />
        <CatButton
          onClickFunction={() => {
            socket.emit('game-loading');
          }}
          text="rank origin"
          width={buttonWidth}
          height={buttonHeight}
        />
        <CatButton
          onClickFunction={() => {
            socket.emit('game-loading');
          }}
          text="normal origin"
          width={buttonWidth}
          height={buttonHeight}
        />
      </div>
    </div>
  );
};

export default GameStartWrapper;
