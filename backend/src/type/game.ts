import { Socket } from 'socket.io';

export type PlayerNumber = 'player1' | 'player2';

export type BallInfo = {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
}

export type ScoreInfo = {
  playerNumber: PlayerNumber;
  loser: PlayerNumber;
}

export type QueueInfo = {
  client: Socket;
  nickname: string;
}

export type GameInfo = {
  roomName: string;
  player1: {
    nickname: string;
    score: number;
  }
  player2: {
    nickname: string;
    score: number;
  }
}

export type RoomName = string;
