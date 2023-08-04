/* eslint-disable react/react-in-jsx-scope */
import { Dispatch, SetStateAction, useContext } from 'react';
import { SocketContext } from '../../../context/socket';

export default function Start({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  const socket = useContext(SocketContext);
  return (
    <div className="button-wrapper">
      <button className="start" onClick={() => {
        socket.emit('startGame', { message: 'start' });
        // room 잡혀야만 게임시작
        console.log(socket);
        // if (socket.rooms) {
        //   setGameStatus(1);
        // }
        }} >Start</button>
    </div>
  );
}