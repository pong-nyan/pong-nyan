import { Dispatch, SetStateAction, useEffect, useRef, KeyboardEvent} from 'react';
import { Engine, Render, World, Runner } from 'matter-js';
import { initEngine, initOriginPongWorld} from '@/game/matterEngine/matterJsSet';
import { movePlayer, movePaddle, getOwnTarget } from '@/game/matterEngine/player';
import { eventOnCollisionStart, eventOnCollisionEnd, eventOnBeforeUpdate } from '@/game/matterEngine/matterJsGameEvent';
import { PlayerNumber, Score, CanvasSize } from '@/type/gameType';
import { Nickname } from '@/type/userType';
import { ScoreBoard } from '@/game/components/ScoreBoard';
import { 
  socketEmitGameKeyEvent,
  socketEmitGameScoreEvent, 
  socketOnGameBallEvent, 
  socketOnGameKeyEvent, 
  socketOnGameScoreEvent, 
  socketOnGameDisconnectEvent,
  socketOffGameAllEvent
} from '@/context/socketGameEvent';
    
import styles from '@/game/styles/Run.module.css';

const OriginPongRun = ({setGameStatus, playerNumber, opponentId, score, setScore}: {
  setGameStatus: Dispatch<SetStateAction<number>>,
  playerNumber: PlayerNumber, 
  opponentId: string | undefined, 
  score: { p1: Score, p2: Score }, 
  setScore: Dispatch<SetStateAction<{ p1: Score, p2: Score }>>
  }) => {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>();
  const render = useRef<Render>();
  const runner = useRef<Runner>();
  const nonCollisionGroupRef = useRef<number>(0);
  const hingeGroupRef = useRef<number>(0);
  let debouncingFlag = false;

  const handleKeyDown = (engine: Engine, e: KeyboardEvent, cw: number) => {
    if (!playerNumber || !opponentId) return ;
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
    if (!playerNumber || !opponentId) return ;
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
    if (!scene.current || !playerNumber) return;

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
    initOriginPongWorld(engine.current.world, sceneSize.width, sceneSize.height, nonCollisionGroupRef.current, hingeGroupRef.current);
    initEngine(engine.current);

    /* matterjs event on */
    eventOnBeforeUpdate(engine.current);
    eventOnCollisionStart(engine.current, runner.current, playerNumber, setScore);
    eventOnCollisionEnd(engine.current);

    /* socket on event */
    socketOnGameKeyEvent(engine.current);   // 상대방의 키 이벤트를 받아서 처리
    socketOnGameBallEvent(engine.current);  // 공 위치, 속도 동기화
    socketOnGameScoreEvent(sceneSize, engine.current, runner.current, setScore);
    socketOnGameDisconnectEvent(sceneSize, engine.current, runner.current, setScore, setGameStatus);
    // run the engine
    Runner.run(runner.current, engine.current);
    Render.run(render.current);

    return () => {
      // destroy Matter
      if (!engine.current || !render.current || !runner.current) return;
      Runner.stop(runner.current);
      Render.stop(render.current);
      World.clear(engine.current.world, false);
      Engine.clear(engine.current);
      render.current.canvas.remove();
      render.current.textures = {};
      socketOffGameAllEvent();
    };
  }, [setGameStatus, playerNumber, opponentId, setScore]);

  useEffect(() => {
    if (!playerNumber) return;
    socketEmitGameScoreEvent(playerNumber, score);
  }, [playerNumber, score]);

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
};

export default OriginPongRun;
