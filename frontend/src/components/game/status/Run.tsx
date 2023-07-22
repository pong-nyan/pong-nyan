import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Engine, Render, World, Bodies, Runner } from 'matter-js';

export default function Run({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  const scene = useRef(null);
  const engine = useRef<Engine>();
  const render = useRef<Render>();
  const runner = useRef<Runner>();

  useEffect(() => {
    if (!scene.current) return;
    engine.current = Engine.create();

    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;
  
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
      
    // boundaries
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
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
    };
  }, []);

  const isPressed = useRef(false);

  const handleDown = () => {
    isPressed.current = true;
  };

  const handleUp = () => {
    isPressed.current = false;
  };

  const handleAddCircle = e => {
    if (!engine.current || !isPressed.current) return;
    const ball = Bodies.circle(
      e.clientX,
      e.clientY,
      10 + Math.random() * 30,
      {
        mass: 10,
        restitution: 0.9,
        friction: 0.005,
        render: {
          fillStyle: '#0000ff'
        }
      });
    World.add(engine.current.world, [ball]);
  };

  return (
    <div onMouseDown={handleDown} onMouseUp={handleUp} onMouseMove={handleAddCircle}>
      <div ref={scene} style={{ width: '100%', height: '100%' }} ></div>
    </div>
  );
}