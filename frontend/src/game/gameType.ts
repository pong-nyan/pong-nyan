export type KeyEventMessage =
  | 'leftDown'
  | 'rightDown'
  | 'leftUp'
  | 'rightUp'
  | 'spaceDown'
  | 'spaceUp';

export type Player = {
  hingeLeft: Matter.Body;
  hingeRight: Matter.Body;
  paddleLeft: Matter.Body;
  paddleRight: Matter.Body;
  stopperLeftTop: Matter.Body;
  stopperLeftBottom: Matter.Body;
  stopperRightTop: Matter.Body;
  stopperRightBottom: Matter.Body;
  jointLeft: Matter.Constraint;
  joinRight: Matter.Constraint;
};

export type Nickname = {
  p1: string;
  p2: string;
}

export type PlayerNumber = 'player1' | 'player2';

export type CollisionEvent = {
  playerNumber: PlayerNumber;
};

export type KeyDownEvent = {
  playerNumber: PlayerNumber;
  data: string;
};

export type KeyUpEvent = {
  playerNumber: PlayerNumber;
  data: string;
};

export type Score = {
  p1: number;
  p2: number;
};

export type CanvasSize = {
  width: number;
  height: number;
};

export type GameInfo = {
  score: Score;
  nickname: Nickname;
}

