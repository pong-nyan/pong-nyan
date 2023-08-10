import Matter, { Body } from 'matter-js';
import { boundary, ball, sensorBar, paddle } from './matterJsUnit';

export const initEngine = (engine: Matter.Engine) => {
  // word setting, zero gravity
  engine.gravity.x = 0;
  engine.gravity.y = 0;

  engine.timing.timeScale = 1;
  
  // 완전 탄성 충돌, zero friction
  engine.world.bodies.forEach(body => {
    body.friction = 0;
    body.frictionAir = 0;
    if (body.label.match(/^Stopper/ || /^Paddle/)) return;
    body.restitution = 1;
  });
}

export const initWorld = (world: Matter.World, cw: number, ch: number, radius: number, group: number) => {
    //TODO: remove
    const width = 100;
    const height = 30;
    const bar = paddle(cw / 2, ch / 2, width, height, 'bar', group);

    Body.setCentre(bar, { x: -width / 2, y: 0}, true);


    Matter.World.add(world, [
      boundary(cw / 2, -10, cw, 20),
      boundary(-10, ch / 2, 20, ch),
      boundary(cw / 2, ch + 10, cw, 20),
      boundary(cw + 10, ch / 2, 20, ch),
      ball(cw / 2, ch / 2, radius, group),
      bar
    ]);
}

export const sensorAdd = (world: Matter.World, cw: number, ch: number) => {
    Matter.World.add(world, [
        sensorBar(cw / 2, 0.97 * ch, cw, 20)
    ]);
}
