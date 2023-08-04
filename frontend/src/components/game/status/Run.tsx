import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Runner, Events } from 'matter-js';
import styles from '../../../styles/Run.module.css';
import { initEngine, initWorld, sensorAdd } from '../../../matterEngine/matterJsSet';

export default function Run({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>();
  const render = useRef<Render>();
  const runner = useRef<Runner>();
  const nonCollisionGroupRef = useRef<number>(0);
  const groupsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!scene.current) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('keydown');
      const step = 24;
      switch (e.key) {
      case 'ArrowLeft':
        movePlayer(-step);
        break;
      case 'ArrowRight':
        movePlayer(step);
        break;
      case ' ':
        movePaddle(0.1);
        break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);


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
    if (!groupsRef.current) return;
    groupsRef.current.push(nonCollisionGroupRef.current);
    
    initWorld(engine.current.world, cw, ch, radius, groupsRef.current);
    initEngine(engine.current);

    // start moving ball
    Matter.Body.setVelocity(engine.current.world.bodies.find(body => body.label === 'Ball') as Matter.Body, { x: 10 , y: 12 });

    
 
    //  Sensor 추가
    sensorAdd(engine.current.world, cw, ch); 
    //  Sensor 로직. sensor 에 충돌했을 때 console.log 발생
    Events.on(engine.current, 'collisionStart', (e) => {
      const pairs = e.pairs;
      pairs.forEach(pair => {
        if (pair.isSensor) {
          console.log('object');
          // sensor 에 닿아서 점수 잃기
        }
      });
    });
    // paddle 추가
    const hingeLeft = Bodies.rectangle(0.3 * cw , 0.94 * ch, 10, 10, { isStatic: true, label: 'HingeLeft' ,render: { visible: true }});
    const hingeRight = Bodies.rectangle(0.6 * cw, 0.94 * ch, 10, 10, { isStatic: true, label: 'HingeRight',render: { visible: true }});
    const paddleLeft = Bodies.rectangle(0.3 * cw + 25, 0.94 * ch, 50, 20, { isStatic: false, label: 'PaddleLeft', render: { visible: true }});
    const paddleRight = Bodies.rectangle(0.6 * cw - 25, 0.94 * ch, 50, 20, { isStatic: false, label: 'PaddleRight', render: { visible: true }});
    // paddle stopper
    const stopperRadius = 20;
    const stopperGapY = 40;
    const stopperGapX = 10;
    const paddleLeftTopStopper = Bodies.circle(0.3 * cw + stopperGapX, 0.94 * ch + stopperGapY, stopperRadius,  { isStatic: true, collisionFilter: { group: nonCollisionGroupRef.current }, label: 'PaddleLeftTopStopper', render: { visible: true }});
    const paddleRightTopStopper = Bodies.circle(0.6 * cw - stopperGapX, 0.94 * ch + stopperGapY, stopperRadius, { isStatic: true, collisionFilter: { group: nonCollisionGroupRef.current }, label: 'PaddleRightTopStopper', render: { visible: true }});
    const paddleLeftBottomStopper = Bodies.circle(0.3 * cw + stopperGapX, 0.94 * ch - stopperGapY, stopperRadius, { isStatic: true, collisionFilter: { group: nonCollisionGroupRef.current }, label: 'PaddleLeftBottomStopper', render: { visible: true }});
    const paddleRightBottomStopper = Bodies.circle(0.6 * cw - stopperGapX, 0.94 * ch - stopperGapY, stopperRadius, { isStatic: true, collisionFilter: { group: nonCollisionGroupRef.current }, label: 'PaddleRightBottomStopper', render: { visible: true }});
    World.add(engine.current.world, [hingeLeft, hingeRight, paddleLeft, paddleRight, paddleLeftTopStopper, paddleRightTopStopper, paddleLeftBottomStopper, paddleRightBottomStopper]);

    // paddle joint
    const paddleLeftJoint = Matter.Constraint.create({
      bodyA: hingeLeft,
      bodyB: paddleLeft,
      pointA: { x: 0, y: 0 },
      pointB: { x: -25, y: 0 },
      stiffness: 1,
      length: 0
    });
    const paddleRightJoint = Matter.Constraint.create({
      bodyA: hingeRight,
      bodyB: paddleRight,
      pointA: { x: 0, y: 0 },
      pointB: { x: 25, y: 0 },
      stiffness: 1,
      length: 0
    });
    World.add(engine.current.world, [paddleLeftJoint, paddleRightJoint]);
    // run the engine
    Runner.run(runner.current, engine.current);
    Render.run(render.current);
    console.log('useEffect call');
    return () => {
      // destroy Matter
      if (!engine.current || !render.current) return;
      Render.stop(render.current);
      World.clear(engine.current.world, false);
      Engine.clear(engine.current);
      render.current.canvas.remove();
      render.current.textures = {};
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const movePlayer = (dx: number) => {
    const paddleLeft = engine.current?.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
    const paddleRight = engine.current?.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
    const paddleLeftTopStopper = engine.current?.world.bodies.find(body => body.label === 'PaddleLeftTopStopper') as Matter.Body;
    const paddleRightTopStopper = engine.current?.world.bodies.find(body => body.label === 'PaddleRightTopStopper') as Matter.Body;
    const paddleLeftBottomStopper = engine.current?.world.bodies.find(body => body.label === 'PaddleLeftBottomStopper') as Matter.Body;
    const paddleRightBottomStopper = engine.current?.world.bodies.find(body => body.label === 'PaddleRightBottomStopper') as Matter.Body;
    const hingeLeft = engine.current?.world.bodies.find(body => body.label === 'HingeLeft') as Matter.Body;
    const hingeRight = engine.current?.world.bodies.find(body => body.label === 'HingeRight') as Matter.Body;
    if (!paddleLeft || !paddleRight || !paddleLeftTopStopper || !paddleRightTopStopper || !paddleLeftBottomStopper || !paddleRightBottomStopper || !hingeLeft || !hingeRight) return;
    Body.translate(paddleLeft, { x: dx, y: 0 });
    Body.translate(paddleRight, { x: dx, y: 0 });
    Body.translate(paddleLeftTopStopper, { x: dx, y: 0 });
    Body.translate(paddleRightTopStopper, { x: dx, y: 0 });
    Body.translate(paddleLeftBottomStopper, { x: dx, y: 0 });
    Body.translate(paddleRightBottomStopper, { x: dx, y: 0 });
    Body.translate(hingeLeft, { x: dx, y: 0 });
    Body.translate(hingeRight, { x: dx, y: 0 });
  };

  const movePaddle = (rad: number) => {
    const paddleLeft = engine.current?.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
    const paddleRight = engine.current?.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
    if (!paddleLeft || !paddleRight) return;
    Body.applyForce(paddleLeft, paddleLeft.position, { x: 0, y: -0.01 });
    Body.applyForce(paddleRight, paddleRight.position, { x: 0, y: -0.01 });
    setTimeout(() => {
      Body.setAngle(paddleLeft, -0.3);
      Body.setAngle(paddleRight, 0.3);
    }, 100);
    console.log(paddleLeft, paddleRight);
  };

  return (
    <div className={styles.sceneWrapper}>
      <div ref={scene} className={styles.scene}></div>
    </div>
  );
}
