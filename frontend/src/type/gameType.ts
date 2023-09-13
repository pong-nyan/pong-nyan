import { SocketId } from './socketType';
import { IntraId, Nickname } from './userType';

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

export enum Timer {
  First = 5,
  Score = 3,
  Disconnect = 10,
}

export type PlayerNumber = | '' | 'player1' | 'player2';

/*
* shared between frontend and backend
* below type
*/

export type Score = number;

export type GameInfo = {
  gameStatus: GameStatus,
  clientId: { p1: SocketId, p2: SocketId },
  intraId: { p1: IntraId, p2: IntraId },
  score: { p1: number, p2: number },
  nickname: { p1: Nickname, p2: Nickname },
  waitList: { playerNumber: PlayerNumber, score: { p1: number, p2: number } }[],
  ballInfo: BallInfo
}

export type BallInfo = {
  position: { x: number, y: number },
  velocity: { x: number, y: number }
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

