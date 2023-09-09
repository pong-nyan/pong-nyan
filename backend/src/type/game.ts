import { Socket } from 'socket.io';

export type PlayerNumber = 'player1' | 'player2';

export type BallInfo = {
  position: { x: number, y: number };
  velocity: { x: number, y: number };
}

export type QueueInfo = {
  client: Socket;
  nickname: string;
}

// game-<nickname1>:<nickname2>
export type RoomName = string;

export type Nickname = {
  p1: string;
  p2: string;
}

export type Score = {
  p1: number;
  p2: number;
}

export type GameInfo = {
  score: Score;
  nickname: Nickname;
  waitList: { playerNumber: PlayerNumber, score: Score }[];
  ballInfo: BallInfo;
}

