import Matter, { World, Body } from 'matter-js';
import { boundary, ball, sensor } from './matterJsUnit';
import { makeHinge, makePaddle, makeStopper, makeJoint } from '@/matterEngine/player';
import { Player, PlayerNumber } from '../type';

export const initWorld = (world: World, cw: number, ch: number, nonCollisionGroupRef: number, hingeGroupRef:number) => {
  nonCollisionGroupRef = Body.nextGroup(true);
  hingeGroupRef= Body.nextGroup(true);
  const ballRadius = cw / 10;
  World.add(world, [
    ...boundaryList(cw, ch),
    ...sensorList(cw, ch),
    ball(cw / 2, ch / 2, ballRadius, nonCollisionGroupRef),
    ...Object.values(initPlayer('player1', cw, ch, nonCollisionGroupRef, hingeGroupRef)),
    ...Object.values(initPlayer('player2', cw, ch, nonCollisionGroupRef, hingeGroupRef))
  ]);
  console.log(world.bodies);
  // start moving ball
  Body.setVelocity(world.bodies.find(body => body.label === 'Ball') as Body, { x: 10, y: 12 });
};

export function initPlayer(playerNumber:PlayerNumber, cw: number, ch: number, nonCollisionGroupRef: number, hingeGroupRef: number) : Player {
  //TODO: Run 수정해야함
  const yScale = playerNumber === 'player1' ? 0.9 : 0.1;
  const offsetX = 70;
  const middleX = cw / 2;
  const [ hingeLeft, hingeRight ] = makeHinge(middleX, offsetX, yScale * ch, hingeGroupRef);
  const [ paddleLeft, paddleRight ] = makePaddle(middleX, offsetX, yScale * ch, hingeGroupRef);
  const [ stopperLeftBottom, stopperRightBottom, stopperLeftTop, stopperRightTop ] = makeStopper(playerNumber, middleX, yScale * ch, nonCollisionGroupRef);
  const [ jointLeft, joinRight ] = makeJoint(hingeLeft, hingeRight, paddleLeft, paddleRight);
  return { hingeLeft, hingeRight, paddleLeft, paddleRight, stopperLeftTop, stopperLeftBottom, stopperRightTop, stopperRightBottom, jointLeft, joinRight};
}

export const boundaryList = (cw: number, ch: number) => {
  const thickness = 20;
  return [
    boundary(cw / 2, -thickness / 2, cw, thickness),      // top
    boundary(-thickness / 2, ch / 2, thickness, ch),      // left
    boundary(cw / 2, ch + thickness / 2, cw, thickness),  // bottom
    boundary(cw + thickness / 2, ch / 2, thickness, ch),  // right
  ];
};

export const sensorList = (cw: number, ch: number) => {
  const thickness = 20;
  const offset = 10;
  const sensorY1 = ch - thickness / 2;
  const sensorY2 = thickness / 2;
  return [ 
    sensor('player1', cw / 2, sensorY1 - offset, cw, thickness),
    sensor('player2', cw / 2, sensorY2 + offset, cw, thickness)
  ];
};

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
