/* eslint-disable react/react-in-jsx-scope */
import { Dispatch, SetStateAction, useContext } from 'react';
import { SocketContext } from '../../../context/socket';

export default function Start({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  const socket = useContext(SocketContext);
  return (
    <div className="button-wrapper">
      <button className="start" onClick={() => {
        socket.emit('startGame', { message: 'start' });
        setGameStatus(1);
        }} >Start</button>
    </div>
  );
}