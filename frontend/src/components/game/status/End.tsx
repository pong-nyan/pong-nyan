import { Dispatch, SetStateAction } from 'react';

export default function End({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  return (
    <div className="button-wrapper">
      <button className="end" onClick={() => setGameStatus(0)} >End</button>
    </div>
  );
}