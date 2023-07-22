/* eslint-disable react/react-in-jsx-scope */
import { Dispatch, SetStateAction } from 'react';

export default function Start({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  return (
    <div className="button-wrapper">
      <button className="start" onClick={() => setGameStatus(1)} >Start</button>
    </div>
  );
}