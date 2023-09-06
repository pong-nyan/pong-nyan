import { Dispatch, SetStateAction } from 'react';
import { socket } from '@/context/socket';
import { KeyEventMessage, PlayerNumber } from '@/type';
import { Body, Engine } from 'matter-js';
import { findTarget } from '@/matterEngine/matterJsUnit';
import { movePlayer, movePaddle } from '@/matterEngine/player';
import { resumeGame } from '@/components/game/logic/resumeGame';
import { Score } from '@/type';

/**
 * 게임 키 이벤트를 서버로 전송합니다. 
 * @param playerNumber: PlayerNumber 
 * @param opponentId: string 
 * @param message: KeyEventMessage 
 * @param step default 0
 * @param velocity default 0
 * @returns 
 */
export const socketEmitGameKeyEvent = (playerNumber: PlayerNumber, opponentId: string, message: KeyEventMessage, step: number = 0, velocity: number = 0) =>
  socket.emit('game-keyEvent', {
    playerNumber,
    opponentId,
    message,
    step,
    velocity,
  });

/**
 * 게임 Key 이벤트를 서버에서 받아와 업데이트합니다.
 * @param engine
 * @returns
 *
 */
export const socketOnGameKeyEvent = (engine: Engine | undefined) => {
  socket.on('game-keyEvent', ({opponentNumber, message, step, velocity}
    : {opponentNumber: PlayerNumber, message: KeyEventMessage, step: number, velocity: number}) => {
    if (!engine) return ;
    switch (message) {
    case 'leftDown':
      movePlayer(engine, opponentNumber, -step);
      break;
    case 'rightDown':
      movePlayer(engine, opponentNumber, step);
      break;
    case 'spaceDown':
      movePaddle(engine, opponentNumber, velocity);
      break;
    case 'spaceUp':
      movePaddle(engine, opponentNumber, -velocity);
      break;
    }
  });
};

/**
 * 게임 Ball의 위치와 속도를 서버로 전송합니다.
 * @param position
 * @param velocity
 * @returns
 */
export const socketEmitGameBallEvent = (position: Matter.Vector, velocity: Matter.Vector) =>
  socket.emit('game-ball', {
    position,
    velocity,
  });

/**
 * 게임 Ball의 위치와 속도를 서버에서 받아와 업데이트합니다. 
 * @param engine 
 * @returns 
 */
export const socketOnGameBallEvent = (engine: Engine | undefined) =>
  socket.on('game-ball', ({ position, velocity }: { position: Matter.Vector, velocity: Matter.Vector }) => {
    if (!engine || !engine.world) return;
    const ball = findTarget(engine.world, 'Ball');
    if (!ball) return;
    Body.setPosition(ball, position);
    Body.setVelocity(ball, velocity);
  });

/**
 * 진 플레이어의 이름을 서버로 전송합니다.
 * @param playerNumber 전송하는 플레이어의 번호
 * @param loser 진 플레이어의 이름
 */
export const socketEmitGameScoreEvent = (playerNumber: PlayerNumber, loser: string) => {
  socket.emit('game-score', { 
    playerNumber: playerNumber, 
    loser
  });
};

/**
 * 진 플레이어의 이름을 서버에서 받아와 스코어를 업데이트합니다. 
 * @param engine
 * @returns
 */
export const socketOnGameScoreEvent = (engine: Engine | undefined, setScore: Dispatch<SetStateAction<Score>>) => {
  socket.on('game-score', ({ loser }: { loser: PlayerNumber }) => {
    if (!engine || !engine.world) return;
    setScore((prevScore: Score) => {
      if (loser === 'player1')  { return { p1: prevScore.p1, p2: prevScore.p2 + 1}; } 
      else if (loser === 'player2') { return { p1: prevScore.p1 + 1, p2: prevScore.p2}; }
      else { return prevScore; }
    });
    resumeGame(engine, loser);
  });
};

