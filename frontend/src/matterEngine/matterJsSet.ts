import Matter from 'matter-js';
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
};

export const initWorld = (world: Matter.World, cw: number, ch: number, radius: number, group: number) => {
  //TODO: remove
  Matter.World.add(world, [
    boundary(cw / 2, -10, cw, 20),
    boundary(-10, ch / 2, 20, ch),
    boundary(cw / 2, ch + 10, cw, 20),
    boundary(cw + 10, ch / 2, 20, ch),
    ball(cw / 2, ch / 2, radius, group),
  ]);
};

export const sensorAdd = (world: Matter.World, loserName: string, cw: number, ch: number) => {
  const thickness = 20;
  const offset = 10;
  const sensorY1 = ch - thickness / 2;
  const sensorY2 = thickness / 2;
  Matter.World.add(world, [
    loserName === 'player1' ? sensorBar(loserName, cw / 2, sensorY1 - offset, cw, thickness) 
      : sensorBar(loserName, cw / 2, sensorY2 + offset, cw, thickness)
  ]);
};
