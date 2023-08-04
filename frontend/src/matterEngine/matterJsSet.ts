import Matter from 'matter-js';
import { boundary, ball, sensorBar } from './matterJsUnit';

export function initEngine(engine: Matter.Engine) {
  // word setting, zero gravity
  engine.gravity.x = 0;
  engine.gravity.y = 0;

  engine.timing.timeScale = 0.1;
  
  // 완전 탄성 충돌, zero friction
  engine.world.bodies.forEach(body => {
    if (body.label.match('Stopper')) return;
    body.restitution = 1;
    body.friction = 0;
    body.frictionAir = 0;
  });
}


export function initWorld(world: Matter.World, cw: number, ch: number, radius: number, group: number) {
    Matter.World.add(world, [
      boundary(cw / 2, -10, cw, 20),
      boundary(-10, ch / 2, 20, ch),
      boundary(cw / 2, ch + 10, cw, 20),
      boundary(cw + 10, ch / 2, 20, ch),
      ball(cw / 2, ch / 2, radius, group) // no collision group
    ]);
}

export function sensorAdd(world: Matter.World, cw: number, ch: number) {
    Matter.World.add(world, [
        sensorBar(cw / 2, 0.97 * ch, cw, 20)
    ]);
}
