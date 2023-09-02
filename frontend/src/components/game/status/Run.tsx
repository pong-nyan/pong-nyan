import { Dispatch, SetStateAction, useEffect, useRef, KeyboardEvent} from 'react';
import { Engine, Render, World, Body, Runner, Events } from 'matter-js';
import styles from '../../../styles/Run.module.css';
import { initEngine, initWorld, sensorAdd } from '../../../matterEngine/matterJsSet';
import { movePlayer, movePaddle } from '../../../matterEngine/player';
import { initPlayer } from '@/matterEngine/player';
import { socket } from '@/context/socket';
import { KeyEventMessage, PlayerNumber, Score } from '../../../type';
import { ball, findTarget } from '@/matterEngine/matterJsUnit';
import { ScoreBoard } from '../../../components/game/ScoreBoard';
import { socketEmitGameBallEvent, socketEmitGameKeyEvent, socketEmitGameScoreEvent, socketOnGameBallEvent, socketOnGameKeyEvent } from '@/context/socketGameEvent';

export default function Run({ setGameStatus, playerNumber, opponentId, score, setScore }
  : { setGameStatus: Dispatch<SetStateAction<number>>, playerNumber: PlayerNumber, opponentId: string, score: Score, setScore: Dispatch<SetStateAction<Score>> }) {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>();
  const render = useRef<Render>();
  const runner = useRef<Runner>();
  const nonCollisionGroupRef = useRef<number>(0);
  const hingeGroupRef = useRef<number>(0);
  let debouncingFlag = false;

  if (playerNumber === 'player2') {
    // scene 의 css transform 을 이용해 180도 회전
    scene.current?.style.setProperty('transform', 'rotate(180deg)');
  }
  const handleKeyDown = (engine: Engine, e: KeyboardEvent) => {
    const step = 24;
    const velocity = 1;

    switch (e.key) {
    case 'ArrowLeft':
      movePlayer(engine, playerNumber, -step);
      socketEmitGameKeyEvent(playerNumber, opponentId, 'leftDown', step);
      break;
    case 'ArrowRight':
      movePlayer(engine, playerNumber, step);
      socketEmitGameKeyEvent(playerNumber, opponentId, 'rightDown', step);
      break;
    case ' ':
      if (debouncingFlag) return ;
      debouncingFlag = true;
      movePaddle(engine, playerNumber, velocity);
      socketEmitGameKeyEvent(playerNumber, opponentId, 'spaceDown', velocity);
      break;
    }
  };

  const handleKeyUp = (engine: Engine, e: KeyboardEvent) => {
    const velocity = 1;

    switch (e.key) {
    case ' ':
      debouncingFlag = false;
      movePaddle(engine, playerNumber, -velocity);
      socketEmitGameKeyEvent(playerNumber, opponentId, 'spaceUp', velocity);
      break;
    }
  };

  // 상대방의 키 이벤트를 받아서 처리
  socketOnGameKeyEvent(engine);
  // 공 위치, 속도 동기화
  socketOnGameBallEvent(engine);

  useEffect(() => {
    if (!scene.current) return;

    // console.log('PlayerNumber: ', playerNumber);
    const cw = scene.current.clientWidth;
    const ch = scene.current.clientHeight;

    engine.current = Engine.create();
    render.current = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent'
      }
    });

    runner.current = Runner.create();

    const radius = cw / 10;

    // 충돌 안하는 그룹
    nonCollisionGroupRef.current = Body.nextGroup(true);
    hingeGroupRef.current= Body.nextGroup(true);
    
    initWorld(engine.current.world, cw, ch, radius, nonCollisionGroupRef.current);
    initEngine(engine.current);

    // start moving ball
    Body.setVelocity(engine.current.world.bodies.find(body => body.label === 'Ball') as Body, { x: 10, y: 12 });

    // 각 유저마다 Sensor 추가
    sensorAdd(engine.current.world, 'player1', cw, ch); 
    sensorAdd(engine.current.world, 'player2', cw, ch * 0.05); 

    Events.on(engine.current, 'collisionStart', (e) => {
      const pairs = e.pairs;
      pairs.forEach(pair => {
        if (pair.isSensor && pair.bodyA.label === 'Ball' ) {
          setScore((prevScore: Score) => {
            if (pair.bodyB.label === 'player1') { return { p1: prevScore.p1 + 1, p2: prevScore.p2 }; }
            else { return { p1: prevScore.p1, p2: prevScore.p2 + 1 }; }
          });
          socketEmitGameScoreEvent(playerNumber, pair.bodyB.label);
        }
      });

      const bodies = e.source.world.bodies;
      bodies.forEach(body => {
        if (body.label === 'Ball') {
          socketEmitGameBallEvent(body.position, body.velocity);
        }
      });
    });

    Events.on(engine.current, 'collisionEnd', (e) => {
      const pairs = e.pairs;
      pairs.forEach(pair => {
        // BottomStopper 와 Paddle 충돌 시 Paddle 의 Velocity, AngularVelocity 0으로 설정하는 이벤트
        if (pair.bodyA.label.match(/^Paddle/) && pair.bodyB.label.match(/^Stopper(.)*Bottom$/)) {
          Body.setVelocity(pair.bodyA, { x: 0, y: 0 });
          Body.setAngularVelocity(pair.bodyA, 0);
        }
        if (pair.bodyB.label.match(/^Paddle/) && pair.bodyA.label.match(/^Stopper(.)*Bottom$/)) {
          Body.setVelocity(pair.bodyB, { x: 0, y: 0 });
          Body.setAngularVelocity(pair.bodyB, 0);
        }
      });
    });

    Events.on(engine.current, 'beforeUpdate', (e) => {
      // limit Balls max speed
      const bodies = e.source.world.bodies;
      bodies.forEach(body => {
        if (body.label === 'Ball') {
          const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
          if (speed > 20) {
            const ratio = 20 / speed;
            Body.setVelocity(body, { x: body.velocity.x * ratio, y: body.velocity.y * ratio });
          } else if (speed < 10) {
            const ratio = 10 / speed;
            Body.setVelocity(body, { x: body.velocity.x * ratio, y: body.velocity.y * ratio });
          }
        } else if (body.label.match(/^Paddle/)) {
          // set limit paddle angular
          if (body.angularVelocity > 0.42) {
            Body.setAngularVelocity(body, 0.42);
          } else if (body.angularVelocity < -0.42) {
            Body.setAngularVelocity(body, -0.42);
          }
        }
      });
    });
    const me = initPlayer('player1', cw, ch, 0.9, nonCollisionGroupRef.current, hingeGroupRef.current);
    const opponent = initPlayer('player2', cw, ch, 0.10, nonCollisionGroupRef.current, hingeGroupRef.current);
    World.add(engine.current.world, Object.values(me));
    World.add(engine.current.world, Object.values(opponent));
  
    // run the engine
    Runner.run(runner.current, engine.current);
    Render.run(render.current);
    return () => {
      // destroy Matter
      if (!engine.current || !render.current) return;
      Render.stop(render.current);
      World.clear(engine.current.world, false);
      Engine.clear(engine.current);
      render.current.canvas.remove();
      render.current.textures = {};
    };
  }, [playerNumber, opponentId, setScore]);

  return (
    <div
      className={styles.sceneWrapper}
      onKeyDown={(e) =>  {
        if (!engine.current) return;
        handleKeyDown(engine.current, e);
      } }
      onKeyUp={(e) =>  {
        if (!engine.current) return;
        handleKeyUp(engine.current, e);
      } }
      tabIndex={0} >
      <div ref={scene} className={styles.scene}>
        <ScoreBoard score={score} playerNumber={playerNumber}/>
      </div>
    </div>
  );
}
// <Score />
