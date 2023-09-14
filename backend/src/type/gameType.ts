import { RoomName } from './socketType';
import { Socket, SocketId } from './socketType';
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

export type QueueInfo = {
  client: Socket,
  nickname: string,
  intraId: number
}

export type MatchingQueue = QueueInfo[];

/*
* shared between frontend and backend
* below type
*/

export type PlayerNumber = 'player1' | 'player2';

export enum GameModeEnum {
  Normal,
  Rank
}


export type BallInfo = {
  position: { x: number, y: number },
  velocity: { x: number, y: number }
}


export type ClientId = {
  p1: string,
  p2: string
}

export type GameInfo = {
  gameStatus: GameStatus,
  clientId: { p1: SocketId, p2: SocketId },
  intraId: { p1: IntraId, p2: IntraId },
  score: { p1: number, p2: number },
  nickname: { p1: Nickname, p2: Nickname },
  waitList: { playerNumber: PlayerNumber, score: { p1: number, p2: number } }[],
  ballInfo: BallInfo
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

