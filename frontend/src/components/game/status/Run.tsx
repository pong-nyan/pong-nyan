import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Runner } from 'matter-js';
import styles from '../../../styles/Run.module.css';

export default function Run({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>();
  const render = useRef<Render>();
  const runner = useRef<Runner>();

  useEffect(() => {
    if (!scene.current) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
      case 'ArrowLeft':
        moveBar(-10);
        break;
      case 'ArrowRight':
        moveBar(10);
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

    const radius = cw / 6;
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

    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, ch * 3 / 4, cw / 3, 20, { isStatic: true, label: 'Bar'}),
    ]);

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