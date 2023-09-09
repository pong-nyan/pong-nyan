import { RoomName } from './socketType';
import { Socket } from './socketType';

export type PlayerNumber = 'player1' | 'player2';

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

export type ClientId = {
  p1: string,
  p2: string
}

export type GameInfo = {
  roomName: RoomName,
  clientId: ClientId,
  score: Score,
  nickname: Nickname,
  waitList: { playerNumber: PlayerNumber, score: Score }[],
  ballInfo: BallInfo
}

export type QueueInfo = {
  client: Socket,
  nickname: string
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

