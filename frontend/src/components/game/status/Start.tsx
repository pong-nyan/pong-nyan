/* eslint-disable react/react-in-jsx-scope */
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { SocketContext } from '../../../context/socket';
import styles from '../../../styles/Start.module.css';
import { PlayerNumber } from '../../../type';

export default function Start({ setGameStatus, setPlayerNumber, setOpponentId }
  : { setGameStatus: Dispatch<SetStateAction<number>>, setPlayerNumber: Dispatch<SetStateAction<PlayerNumber>>, setOpponentId: Dispatch<SetStateAction<string>>}) {
  const socket = useContext(SocketContext);
  const [ loading, setLoading ] = useState(false);

  socket.on('game-randomStart', ({p1, p2}: {p1: string, p2: string}) => {
    if (socket.id === p1) { 
      setPlayerNumber('player1');
      setOpponentId(p2);
    }
    else if (socket.id == p2){
      setPlayerNumber('player2');
      setOpponentId(p1);
    }
    setGameStatus(1);
  });
  socket.on('game-loading', () => {
    setLoading(true);
  });

  return (
    loading ?
      'Loading' :
      <div className={styles.buttonWrapper} onClick={() => {
        socket.emit('game-randomStart', { message: 'start' });
      }} tabIndex={0}>
        <button className={styles.startButton}>Start</button>
      </div> 
  );
}
