import { Dispatch, SetStateAction } from 'react';
import { Body, Engine, Runner } from 'matter-js';
import { KeyEventMessage, PlayerNumber, Score, GameInfo, CanvasSize, GameStatus } from '@/type/gameType';
import { Nickname } from '@/type/userType';
import { SocketId, RoomName } from '@/type/socketType';
import { gameNamespace } from '@/context/socket';
import { findTarget } from '@/game/matterEngine/matterJsUnit';
import { movePlayer, moveOriginalPongPlayer, movePaddle } from '@/game/matterEngine/player';
import { resumeGame } from '@/game/logic/resumeGame';

/**
 * 게임 시작을 서버로 전송합니다.
 * @param gameStatus: GameStatus
 * @returns
 */
export const socketEmitGameStartEvent = (gameStatus: GameStatus) => {
  console.log('socketEmitGameStartEvent', gameNamespace, gameStatus);
  gameNamespace.emit('game-start', {
    gameStatus,
  });
};

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
  gameNamespace.emit('game-keyEvent', {
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
  gameNamespace.on('game-keyEvent', ({opponentNumber, message, step, velocity}
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

export const socketOnGameOriginalPongKeyEvent = (engine: Engine | undefined) => {
  gameNamespace.on('game-keyEvent', ({opponentNumber, message, step, velocity}
    : {opponentNumber: PlayerNumber, message: KeyEventMessage, step: number, velocity: number}) => {
    if (!engine) return ;
    switch (message) {
    case 'leftDown':
      moveOriginalPongPlayer(engine, opponentNumber, -step);
      break;
    case 'rightDown':
      moveOriginalPongPlayer(engine, opponentNumber, step);
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
  gameNamespace.emit('game-ball', {
    position,
    velocity,
  });

/**
 * 게임 Ball의 위치와 속도를 서버에서 받아와 업데이트합니다. 
 * @param engine 
 * @returns 
 */
export const socketOnGameBallEvent = (engine: Engine | undefined) =>
  gameNamespace.on('game-ball', ({ position, velocity }: { position: Matter.Vector, velocity: Matter.Vector }) => {
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
export const socketEmitGameScoreEvent = (playerNumber: PlayerNumber, score: { p1: Score, p2: Score}) => {
  gameNamespace.emit('game-score', { 
    playerNumber,
    score,
  });
};

/**
 * 진 플레이어의 이름을 서버에서 받아와 스코어를 업데이트합니다. 
 * @param engine
 * @returns
 */
export const socketOnGameScoreEvent = (sceneSize: CanvasSize, engine: Engine | undefined, runner: Runner | undefined, setScore: Dispatch<SetStateAction<{p1: Score, p2: Score}>>) => {
  gameNamespace.on('game-score', ( { realScore, winnerNickname } : { realScore: Score, winnerNickname: string }) => {
    if (!engine || !engine.world || !runner ) return;
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

export const socketOnGameDisconnectEvent = (sceneSize: CanvasSize, engine: Engine | undefined, runner: Runner | undefined, setScore: Dispatch<SetStateAction<{p1: Score, p2: Score}>>, setGameStatus: Dispatch<SetStateAction<GameStatus>>, setNickname: Dispatch<SetStateAction<{ p1: Nickname, p2: Nickname}>> ) => {
  gameNamespace.on('game-disconnect', ( { disconnectNickname, gameInfo } : { disconnectNickname: string, gameInfo: GameInfo } ) => {
    if (!engine || !engine.world || !runner) return;
    Runner.stop(runner);
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const { nickname } = JSON.parse(userString);

    nickname == disconnectNickname ? alert('비정상적인 행동을 감지했습니다.') 
      : alert(`${disconnectNickname}이(가) 나갔습니다.`);
    if (disconnectNickname === gameInfo.nickname.p1) {
      setScore((prevScore: { p1: Score, p2: Score }) => { return { p1: prevScore.p1, p2: prevScore.p2 + 1}; });
    } else if (disconnectNickname === gameInfo.nickname.p2) {
      setScore((prevScore: { p1: Score, p2: Score }) => { return { p1: prevScore.p1 + 1, p2: prevScore.p2 }; });
    }
    setNickname({ p1: gameInfo.nickname.p1, p2: gameInfo.nickname.p2 });
    setGameStatus(GameStatus.End);
  });
};

export const socketOnGameStartEvent = (setGameStatus: Dispatch<SetStateAction<GameStatus>>, setPlayerNumber: Dispatch<SetStateAction<PlayerNumber>>, setOpponentId: Dispatch<SetStateAction<SocketId>>) => {
  gameNamespace.on('game-start', ({ player1Id, player2Id, gameStatus }: {roomName: RoomName, player1Id: string, player2Id: string, gameStatus: GameStatus}) => {
    if (gameNamespace.id === player1Id) { 
      setPlayerNumber('player1');
      setOpponentId(player2Id);
    }
    else if (gameNamespace.id == player2Id){
      setPlayerNumber('player2');
      setOpponentId(player1Id);
    }
    setGameStatus(gameStatus);
  });
};

export const socketOnGameLoadingEvent = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  gameNamespace.on('game-loading', () => {
    setLoading(true);
  });
};

export const socketOnGameEnd = (
  setScore: Dispatch<SetStateAction<{ p1: Score, p2: Score }>>,
  setNickname: Dispatch<SetStateAction<{ p1: Nickname, p2: Nickname}>>,
  setGameStatus: Dispatch<SetStateAction<GameStatus>>) => {
  gameNamespace.on('game-end', ({ winnerNickname, gameInfo } : { winnerNickname: Nickname, gameInfo: GameInfo}) => {
    console.log('game-end', winnerNickname, gameInfo);
    getNickname() == winnerNickname ? alert('승리') : alert('패배');
    setNickname({ p1: gameInfo.nickname.p1, p2: gameInfo.nickname.p2 });
    setScore({ p1: gameInfo.score.p1, p2: gameInfo.score.p2 });
    setGameStatus(GameStatus.End);
  });
};

export const socketOffGameAllEvent = () => {
  gameNamespace.off('game-keyEvent');
  gameNamespace.off('game-ball');
  gameNamespace.off('game-score');
  gameNamespace.off('game-disconnect');
  gameNamespace.off('game-start');
  gameNamespace.off('game-loading');
  gameNamespace.off('game-end');
};

export const socketOffGameStartEvent = () => {
  gameNamespace.off('game-start');
  gameNamespace.off('game-loading');
};

const getNickname = () => {
  const userString = localStorage.getItem('user');
  if (!userString) return;
  return JSON.parse(userString).nickname;
};
