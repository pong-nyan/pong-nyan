import Matter, { World, Body } from 'matter-js';
import { boundary, ball, sensor, findTarget } from './matterJsUnit';
import { makeHinge, makePaddle, makeStopper, makeJoint, makeBar } from '@/game/matterEngine/player';
import { PlayerNumber } from '@/type/gameType';
import { Player, OriginPongPlayer } from '@/game/gameType';

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
  // start moving ball
  setStartBall(world, 'player1');
};

export const initOriginPongWorld = (world: World, cw: number, ch: number, nonCollisionGroupRef: number, hingeGroupRef:number) => {
  nonCollisionGroupRef = Body.nextGroup(true);
  hingeGroupRef= Body.nextGroup(true);
  const ballRadius = cw / 10;
  World.add(world, [
    ...boundaryList(cw, ch),
    ...sensorList(cw, ch),
    ball(cw / 2, ch / 2, ballRadius, nonCollisionGroupRef),
    initOriginPongPlayer('player1', cw, ch, nonCollisionGroupRef, hingeGroupRef),
    initOriginPongPlayer('player2', cw, ch, nonCollisionGroupRef, hingeGroupRef)
  ]);
  setStartBall(world, 'player1');
};

export const setStartBall = (world: World, loser: PlayerNumber) => {
  let speed = 5;
  let degree = loser === 'player1' ? 30 : 210;
  const rad = degree * Math.PI / 180;
  const ball = findTarget(world, 'Ball');
  if (!ball) return;
  Body.setVelocity(ball, { x: speed * Math.cos(rad), y: speed * Math.sin(rad)});
  speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
  degree = 90 - Math.atan2(ball.velocity.x, ball.velocity.y) * 180 / Math.PI;
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

export function initOriginPongPlayer(playerNumber:PlayerNumber, cw: number, ch: number, nonCollisionGroupRef: number, hingeGroupRef: number) : OriginPongPlayer {
  //TODO: Run 수정해야함
  const yScale = playerNumber === 'player1' ? 0.9 : 0.1;
  const offsetX = 70;
  const middleX = cw / 2;
  const barMiddle = makeBar(middleX, offsetX, yScale * ch, hingeGroupRef, playerNumber);
  return barMiddle;
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
