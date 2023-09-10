import { RoomName } from './socketType';
import { Socket } from './socketType';

export type CanvasSize = {
  width: number,
  height: number
};

export enum GameStatus {
	Start,
	RankPnRun,
  NormalPnRun,
  RankOriginRun,
  NormalOriginRun,
	End
}

export type PlayerNumber = 'player1' | 'player2';

/*
* shared between frontend and backend
* below type
*/

export type BallInfo = {
  position: { x: number, y: number },
  velocity: { x: number, y: number }
}

export type Nickname = {
  p1: string,
  p2: string
}

export type Score = {
  p1: number,
  p2: number
}

export type KeyEventMessage =
  | 'leftDown'
  | 'rightDown'
  | 'leftUp'
  | 'rightUp'
  | 'spaceDown'
  | 'spaceUp';


export type CollisionEvent = {
  playerNumber: PlayerNumber
};

export type KeyDownEvent = {
  playerNumber: PlayerNumber,
  data: string
};

export type KeyUpEvent = {
  playerNumber: PlayerNumber,
  data: string
};

