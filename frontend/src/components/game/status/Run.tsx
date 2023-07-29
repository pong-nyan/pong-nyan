import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Runner, Events } from 'matter-js';
import styles from '../../../styles/Run.module.css';

export default function Run({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>();
  const render = useRef<Render>();
  const runner = useRef<Runner>();

  useEffect(() => {
    if (!scene.current) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 24;
      switch (e.key) {
      case 'ArrowLeft':
        moveBar(-step);
        break;
      case 'ArrowRight':
        moveBar(step);
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
    const halfAssetWidth = 315;
    const halfAssetHeight = 322;

    // world init
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.circle(cw / 2, ch / 2, radius, { isStatic: false, label: 'Ball', render: { sprite : {texture: '/assets/hairball.png', xScale: radius / halfAssetWidth, yScale: radius / halfAssetHeight}}})
    ]);

    // word setting, zero gravity
    engine.current.gravity.x = 0;
    engine.current.gravity.y = 0;

    // start moving ball
    Matter.Body.setVelocity(engine.current.world.bodies.find(body => body.label === 'Ball') as Matter.Body, { x: 10 , y: 12 });

    // 완전 탄성 충돌, zero friction
    engine.current.world.bodies.forEach(body => {
      body.restitution = 1;
      body.friction = 0;
      body.frictionAir = 0;
    });

    //  Bar 추가
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, 0.94 * ch, cw / 3, 20, { isStatic: true, label: 'Bar'}),
    ]);
    //  Sensor 추가
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, 0.97 * ch, cw, 20, { isStatic: true, label: 'Sensor', isSensor: true}),
    ]);
    //  Sensor 로직. sensor 에 충돌했을 때 console.log 발생
    const sensor = engine.current.world.bodies.find(body => body.label === 'Sensor');
    Events.on(engine.current, 'collisionStart', (e) => {
      const pairs = e.pairs;
      pairs.forEach(pair => {
        if (pair.isSensor)
          // sensor 에 닿아서 점수 잃기
      });
    });

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
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const moveBar = (dx: number) => {
    const bar = engine.current?.world.bodies.find(body => body.label === 'Bar');
    if (!bar) return;
    Matter.Body.translate(bar, { x: dx, y: 0 });
  };

  return (
    <div className={styles.sceneWrapper}>
      <div ref={scene} className={styles.scene}></div>
    </div>
  );
}