/* eslint-disable react/react-in-jsx-scope */
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { SocketContext } from '../../../context/socket';
import styles from '../../../styles/Start.module.css';
import { PlayerNumber } from '../../../type';

export default function Start({ setGameStatus, setPlayerNumber }: { setGameStatus: Dispatch<SetStateAction<number>>, setPlayerNumber: Dispatch<SetStateAction<PlayerNumber>> }) {
  const socket = useContext(SocketContext);
  const [ loading, setLoading ] = useState(false);

  socket.on('start', (p1) => {
    console.log('game start');
    if (socket.id === p1) { setPlayerNumber('player1'); }
    else { setPlayerNumber('player2');}
    setGameStatus(1);
  });
  socket.on('loading', () => {
    setLoading(true);
  });
  return (
    loading ?
      'Loading' :
      <div className={styles.buttonWrapper} onClick={() => {
        socket.emit('startGame', { message: 'start' });
        // room 잡혀야만 게임시작
        // if (socket.rooms) {
        //   setGameStatus(1);
        // }
      }} tabIndex={0}>
        <button className={styles.startButton}>Start</button>
      </div> 
  );
}