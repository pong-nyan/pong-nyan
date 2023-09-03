import { Dispatch, SetStateAction, useEffect, useState, useRef, KeyboardEvent} from 'react';
import { Engine, Render, World, Runner, Body } from 'matter-js';
import styles from '../../../styles/Run.module.css';
import { initEngine, initWorld } from '../../../matterEngine/matterJsSet';
import { findTarget } from '../../../matterEngine/matterJsUnit';
import { movePlayer, movePaddle, getOwnTarget } from '@/matterEngine/player';
import { eventOnCollisionStart, eventOnCollisionEnd, eventOnBeforeUpdate } from '@/matterEngine/matterJsGameEvent';
import { PlayerNumber, Score, CanvasSize } from '@/type';
import { ScoreBoard } from '../../../components/game/ScoreBoard';
import { socketEmitGameKeyEvent, socketOnGameBallEvent, socketOnGameKeyEvent, socketOnGameScoreEvent } from '@/context/socketGameEvent';

export default function Run({ setGameStatus, playerNumber, opponentId, score, setScore }
  : { setGameStatus: Dispatch<SetStateAction<number>>, playerNumber: PlayerNumber, opponentId: string, score: Score, setScore: Dispatch<SetStateAction<Score>> }) {
  const scene = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Engine>();
  const render = useRef<Render>();
  const runner = useRef<Runner>();
  const nonCollisionGroupRef = useRef<number>(0);
  const hingeGroupRef = useRef<number>(0);
  let debouncingFlag = false;
  const [countdown, setCountdown] = useState<number>(0);

  const handleKeyDown = (engine: Engine, e: KeyboardEvent, cw: number) => {
    const step = 24;
    const velocity = 1;

    switch (e.key) {
    case 'ArrowLeft':
      if (playerNumber === 'player1' && getOwnTarget(engine, playerNumber, 'HingeLeft').position.x - step < 0) return;
      else if (playerNumber === 'player2' && getOwnTarget(engine, playerNumber, 'HingeRight').position.x + step > cw) return;
      movePlayer(engine, playerNumber, -step);
      socketEmitGameKeyEvent(playerNumber, opponentId, 'leftDown', step, 0);
      break;
    case 'ArrowRight':
      if (playerNumber === 'player1' && getOwnTarget(engine, playerNumber, 'HingeRight').position.x + step > cw) return;
      else if (playerNumber === 'player2' && getOwnTarget(engine, playerNumber, 'HingeLeft').position.x - step < 0) return;
      movePlayer(engine, playerNumber, step);
      socketEmitGameKeyEvent(playerNumber, opponentId, 'rightDown', step, 0);
      break;
    case ' ':
      if (debouncingFlag) return ;
      debouncingFlag = true;
      movePaddle(engine, playerNumber, velocity);
      socketEmitGameKeyEvent(playerNumber, opponentId, 'spaceDown', 0, velocity);
      break;
    }
  };

  const handleKeyUp = (engine: Engine, e: KeyboardEvent) => {
    const velocity = 1;

    switch (e.key) {
    case ' ':
      debouncingFlag = false;
      movePaddle(engine, playerNumber, -velocity);
      socketEmitGameKeyEvent(playerNumber, opponentId, 'spaceUp', 0, velocity);
      break;
    }
  };

  useEffect(() => {
    if (!scene.current) return;

    // scene 의 css transform 을 이용해 180도 회전
    if (playerNumber === 'player2') { scene.current.style.setProperty('transform', 'rotate(180deg)'); }

    const sceneSize: CanvasSize = { width: scene.current.clientWidth, height: scene.current.clientHeight };

    /* create 3 matterjs instance */
    engine.current = Engine.create();
    render.current = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: sceneSize.width,
        height: sceneSize.height,
        wireframes: false,
        background: 'transparent'
      }
    });
    runner.current = Runner.create();

    /* init matterjs(순서 정말 중요함)*/ 
    initWorld(engine.current.world, sceneSize.width, sceneSize.height, nonCollisionGroupRef.current, hingeGroupRef.current);
    initEngine(engine.current);

    /* matterjs event on */
    eventOnBeforeUpdate(engine.current);
    eventOnCollisionStart(sceneSize, engine.current, runner.current, playerNumber);
    eventOnCollisionEnd(engine.current);

    /* socket on event */
    socketOnGameKeyEvent(engine.current);   // 상대방의 키 이벤트를 받아서 처리
    socketOnGameBallEvent(engine.current);  // 공 위치, 속도 동기화
    socketOnGameScoreEvent(engine.current, runner.current, setScore);

    // run the engine
    Runner.run(runner.current, engine.current);
    Render.run(render.current);

    /* Ball 의 속도와 방향을 0.5초마다 콘솔에 출력 */
    // const ballBody = findTarget(engine.current.world, 'Ball');
    // const timer = setInterval(() => {
    //   if (!engine.current) return;
    //   const speed = Math.sqrt(ballBody.velocity.x ** 2 + ballBody.velocity.y ** 2);
    //   const direction = Math.atan2(ballBody.velocity.x, ballBody.velocity.y) * 180 / Math.PI;
    //   console.log('speed', speed, 'degree', direction < 0 ? direction + 360 : direction);
    // }, 500);

    return () => {
      // destroy Matter
      if (!engine.current || !render.current) return;
      Render.stop(render.current);
      World.clear(engine.current.world, false);
      Engine.clear(engine.current);
      render.current.canvas.remove();
      render.current.textures = {};
    };
  }, [playerNumber, opponentId, setScore, countdown]);

  return (
    <div
      className={styles.sceneWrapper}
      onKeyDown={(e) => {
        if (!engine.current || !scene.current) return;
        handleKeyDown(engine.current, e, scene.current.clientWidth);
      }}
      onKeyUp={(e) => {
        if (!engine.current || !scene.current) return;
        handleKeyUp(engine.current, e);
      }}
      tabIndex={0} >
      <div ref={scene} className={styles.scene}>
        <ScoreBoard score={score} playerNumber={playerNumber}/>
      </div>
    </div>
  );
}
