import { Dispatch, SetStateAction, useEffect, useRef, KeyboardEvent} from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Runner, Events } from 'matter-js';
import styles from '../../../styles/Run.module.css';
import { initEngine, initWorld, sensorAdd } from '../../../matterEngine/matterJsSet';
import { movePlayer, movePaddle } from '../../../matterEngine/player';
import { initPlayer } from '@/matterEngine/player';

export default function Run({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>();
  const render = useRef<Render>();
  const runner = useRef<Runner>();
  const nonCollisionGroupRef = useRef<number>(0);

    const handleKeyDown = (engine: Engine, e: KeyboardEvent) => {
      console.log('keydown');
      const step = 24;
      switch (e.key) {
      case 'ArrowLeft':
        movePlayer(engine, -step);
        break;
      case 'ArrowRight':
        movePlayer(engine, step);
        break;
      case ' ':
        movePaddle(engine, 0.1);
        break;
      }
    };
  useEffect(() => {
    if (!scene.current) return;

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
        background: 'green'
      }
    });

    runner.current = Runner.create();

    const radius = cw / 10;

    // 충돌 안하는 그룹
    nonCollisionGroupRef.current = Body.nextGroup(true);
    
    initWorld(engine.current.world, cw, ch, radius, nonCollisionGroupRef.current);
    initEngine(engine.current);

    // start moving ball
    Matter.Body.setVelocity(engine.current.world.bodies.find(body => body.label === 'Ball') as Matter.Body, { x: 10 , y: 12 });

    
 
    //  Sensor 추가
    sensorAdd(engine.current.world, cw, ch); 
    Events.on(engine.current, 'collisionStart', (e) => {
      const pairs = e.pairs;
      pairs.forEach(pair => {
        if (pair.isSensor && (pair.bodyA.label === 'Ball' || pair.bodyB.label === 'Ball')) {
          setGameStatus(2);
        }
      });
    });

    const player = initPlayer(cw, ch, nonCollisionGroupRef.current);
    World.add(engine.current.world, Object.values(player));
  
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
  }, []);



  return (
    <div
      className={styles.sceneWrapper}
      onKeyDown={(e) =>  {
        if (!engine.current) return;
        handleKeyDown(engine.current, e)
        }
      }
      tabIndex={0} >
      <div ref={scene} className={styles.scene}></div>
    </div>
  );
}
