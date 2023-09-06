import { Constraint, Body, Engine } from 'matter-js';
import { stopper, hinge, paddle, findTargetAll } from './matterJsUnit';
import { CollisionEvent, KeyDownEvent, KeyUpEvent, PlayerNumber } from '../../type';
import { socket } from '@/context/socket';

export const makeHinge = (middleX: number, offsetX: number, baseY: number, hingeGroupRef:number) => {
  const radius = 5;
  const hingeLeft = hinge(middleX - offsetX, baseY, radius, 'HingeLeft', hingeGroupRef);
  const hingeRight = hinge(middleX + offsetX, baseY, radius, 'HingeRight', hingeGroupRef);
  return [ hingeLeft, hingeRight ];
};

export const makePaddle = (middleX: number, offsetX: number, baseY:number, hingeGroupRef:number) => {
  // const paddleWidth = 0.15 * cw;
  const paddleWidth = 50;
  const paddleHeight = 20;
  const paddleLeft = paddle(middleX - offsetX, baseY, paddleWidth, paddleHeight, 'PaddleLeft', hingeGroupRef);
  const paddleRight = paddle(middleX + offsetX, baseY, paddleWidth, paddleHeight, 'PaddleRight', hingeGroupRef);

  Body.setCentre(paddleLeft, { x: -paddleWidth / 2, y: 0}, true);
  Body.setCentre(paddleRight, { x: paddleWidth / 2, y: 0}, true);
  return [ paddleLeft, paddleRight ];
};

export const makeStopper = (playerNumber:PlayerNumber, middleX: number, baseY:number, nonCollisionGroupRef: number) => {

  const stopperOffsetX = 90; // (기존)== cw * 0.333
  const stopperOffsetY = 65;
  const radius = 50;

  const stopperLeftBottom = stopper(middleX - stopperOffsetX, baseY + stopperOffsetY, radius, nonCollisionGroupRef, playerNumber === 'player1'? 'StopperLeftBottom' : 'StopperRightTop');
  const stopperRightBottom = stopper(middleX + stopperOffsetX, baseY + stopperOffsetY, radius, nonCollisionGroupRef, playerNumber === 'player1' ? 'StopperRightBottom' : 'StopperLeftTop');
  const stopperLeftTop = stopper(middleX - stopperOffsetX, baseY - stopperOffsetY, radius, nonCollisionGroupRef, playerNumber === 'player1' ? 'StopperLeftTop' : 'StopperRightBottom');
  const stopperRightTop = stopper(middleX + stopperOffsetX, baseY - stopperOffsetY, radius, nonCollisionGroupRef, playerNumber === 'player1' ? 'StopperRightTop' : 'StopperLeftBottom');
  return [ stopperLeftBottom, stopperRightBottom, stopperLeftTop, stopperRightTop ];
};

export const makeJoint = (hingeLeft: Body, hingeRight: Body, paddleLeft: Body, paddleRight: Body) => {
  const jointLeft = Constraint.create({
    bodyA: hingeLeft,
    bodyB: paddleLeft,
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    stiffness: 1,
    length: 0
  });
  const joinRight = Constraint.create({
    bodyA: hingeRight,
    bodyB: paddleRight,
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    stiffness: 1,
    length: 0
  });
  return [ jointLeft, joinRight ];
};

export const getOwnTarget = (engine: Engine, playerNumber:PlayerNumber, label:string) => {
  const targets = findTargetAll(engine.world, label);
  return playerNumber === 'player1' ? targets[0] : targets[1];
};

export const movePlayer = (engine: Engine, playerNumber: PlayerNumber, dx: number) => {
  const paddleLeft = getOwnTarget(engine, playerNumber, 'PaddleLeft');
  const paddleRight = getOwnTarget(engine, playerNumber, 'PaddleRight');
  const StopperLeftTop = getOwnTarget(engine, playerNumber, 'StopperLeftTop');
  const StopperRightTop = getOwnTarget(engine, playerNumber, 'StopperRightTop');
  const StopperLeftBottom = getOwnTarget(engine, playerNumber, 'StopperLeftBottom');
  const StopperRightBottom = getOwnTarget(engine, playerNumber, 'StopperRightBottom');
  const hingeLeft = getOwnTarget(engine, playerNumber, 'HingeLeft');
  const hingeRight = getOwnTarget(engine, playerNumber, 'HingeRight');

  if (!paddleLeft || !paddleRight || !StopperLeftTop || !StopperRightTop || !StopperLeftBottom || !StopperRightBottom 
      || !hingeLeft || !hingeRight) return;
  dx = playerNumber === 'player1' ? dx : -dx;
  Body.translate(paddleLeft, { x: dx, y: 0 });
  Body.translate(paddleRight, { x: dx, y: 0 });
  Body.translate(StopperLeftTop, { x: dx, y: 0 });
  Body.translate(StopperRightTop, { x: dx, y: 0 });
  Body.translate(StopperLeftBottom, { x: dx, y: 0 });
  Body.translate(StopperRightBottom, { x: dx, y: 0 });
  Body.translate(hingeLeft, { x: dx, y: 0 });
  Body.translate(hingeRight, { x: dx, y: 0 });
};

export const movePaddle = (engine: Engine, playerNumber: PlayerNumber, velocity: number) => {
  const paddleLeft = getOwnTarget(engine, playerNumber, 'PaddleLeft');
  const paddleRight = getOwnTarget(engine, playerNumber, 'PaddleRight');
  if (!paddleLeft || !paddleRight) return;
  velocity = playerNumber === 'player1' ? velocity : -velocity;
  Body.setAngularVelocity(paddleLeft, -velocity);
  Body.setAngularVelocity(paddleRight, velocity);
};

export const movePaddleKeyRotate = (body: Body, direction: number) => {
  Body.setAngularVelocity(body, direction);
};

export const notifyKeyDown= (keyDownEvent:KeyDownEvent) => {
  socket.emit('gameEvent', keyDownEvent);
};

export const notifyKeyUp= (keyUpEvent:KeyUpEvent) => {
  socket.emit('gameEvent', keyUpEvent);
};

export const notifyColision= (collisionEvent: CollisionEvent) => {
  socket.emit('gameEvent', collisionEvent);
};

