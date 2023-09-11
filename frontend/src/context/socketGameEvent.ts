import { Dispatch, SetStateAction } from 'react';
import { Body, Engine, Runner } from 'matter-js';
import { KeyEventMessage, PlayerNumber, Score, GameInfo, CanvasSize, GameStatus } from '@/type/gameType';
import { SocketId, RoomName } from '@/type/socketType';
import { socket } from '@/context/socket';
import { findTarget } from '@/game/matterEngine/matterJsUnit';
import { movePlayer, movePaddle } from '@/game/matterEngine/player';
import { resumeGame } from '@/game/logic/resumeGame';

/**
 * 게임 시작을 서버로 전송합니다.
 * @param gameStatus: GameStatus
 * @returns
 */
export const socketEmitGameStartEvent = (gameStatus: GameStatus) => {
  console.log('socketEmitGameStartEvent', socket, gameStatus);
  socket.emit('game-start', {
    gameStatus,
  });
}

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
 * @param 업데이트 된 score
 */
export const socketEmitGameScoreEvent = (playerNumber: PlayerNumber, score: Score) => {
  socket.emit('game-score', { 
    playerNumber,
    score,
  });
};

/**
 * 진 플레이어의 이름을 서버에서 받아와 스코어를 업데이트합니다. 
 * @param engine
 * @returns
 */
export const socketOnGameScoreEvent = (sceneSize: CanvasSize, engine: Engine | undefined, setScore: Dispatch<SetStateAction<Score>>) => {
  socket.on('game-score', ( { realScore, winnerNickname } : { realScore: Score, winnerNickname: string }) => {
    if (!engine || !engine.world) return;
    if (realScore.p1 === 0 && realScore.p2 === 0) {
      resumeGame(sceneSize, engine, 5, '게임 시작!');
    } else if (winnerNickname === '') {
      setScore({ p1: realScore.p1, p2: realScore.p2 });
      resumeGame(sceneSize, engine, 3, '리매치!');
    } else {
      resumeGame(sceneSize, engine, 3, `${winnerNickname} 승리!`);
    }
  });
};

// export const socketEmitGameDisconnectEvent = (socket: Socket) => {
//   socket.emit('game-disconnect');
// }

export const socketOnGameDisconnectEvent = (sceneSize: CanvasSize, engine: Engine | undefined, runner: Runner | undefined, setScore: Dispatch<SetStateAction<Score>>, setGameStatus: Dispatch<SetStateAction<GameStatus>>) => {
  socket.on('game-disconnect', ( { disconnectNickname, gameInfo } : { disconnectNickname: string, gameInfo: GameInfo } ) => {
    if (!engine || !engine.world || !runner) return;
    Runner.stop(runner);
    alert(`${disconnectNickname}님이 나가셨습니다.`);
    console.log('game-disconnect', disconnectNickname, gameInfo);
    setGameStatus(GameStatus.End);
    setScore({ p1: gameInfo.score.p2, p2: gameInfo.score.p2 });
  });
};

export const socketOnGameStartEvent = (setGameStatus: Dispatch<SetStateAction<GameStatus>>, setPlayerNumber: Dispatch<SetStateAction<PlayerNumber>>, setOpponentId: Dispatch<SetStateAction<SocketId>>) => {
  if (!socket) return;
  socket.on('game-start', ({ player1Id, player2Id }: {roomName: RoomName, player1Id: string, player2Id: string}) => {
    if (socket.id === player1Id) { 
      setPlayerNumber('player1');
      setOpponentId(player2Id);
    }
    else if (socket.id == player2Id){
      setPlayerNumber('player2');
      setOpponentId(player1Id);
    }
    setGameStatus(GameStatus.RankPnRun);
  });
}

export const socketOnGameLoadingEvent = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  if (!socket) return;
  socket.on('game-loading', () => {
    setLoading(true);
  });
}

