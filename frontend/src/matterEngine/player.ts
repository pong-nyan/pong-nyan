import { Constraint, Body, Engine } from 'matter-js';
import { stopper, hinge, paddle, findTargetAll } from './matterJsUnit';
import { Colision, CollisionEvent, GameEvent, KeyDownEvent, KeyUpEvent, Player, PlayerNumber } from '../type';
import { socket } from '@/context/socket';

const makeHinge = (baseX:number, baseY:number, hingeGroupRef:number) => {
  const hingeGapX = 20;
  const hingeRadius = 5;
  const hingeLeft = hinge(baseX - hingeGapX, baseY, hingeRadius, 'HingeLeft', hingeGroupRef);
  const hingeRight = hinge(2 * baseX + hingeGapX, baseY, hingeRadius, 'HingeRight', hingeGroupRef);
  return [ hingeLeft, hingeRight ];
}

const makePaddle = (baseX:number, baseY:number, hingeGroupRef:number) => {
  // const paddleWidth = 0.15 * cw;
  const paddleWidth = 50;
  const paddleHeight = 20;
  const paddleLeft = paddle(baseX, baseY, paddleWidth, paddleHeight, 'PaddleLeft', hingeGroupRef);
  const paddleRight = paddle(2 * baseX, baseY, paddleWidth, paddleHeight, 'PaddleRight', hingeGroupRef);

  Body.setCentre(paddleLeft, { x: -paddleWidth / 2, y: 0}, true);
  Body.setCentre(paddleRight, { x: paddleWidth / 2, y: 0}, true);
  return [ paddleLeft, paddleRight ];
}

const makeStopper = (playerNumber:PlayerNumber, baseX:number, baseY:number, nonCollisionGroupRef: number) => {
  const stopperRadius = 50;
  const stopperGapY = 65;
  const stopperGapX = -40;
  const stopperLeftBottom = stopper(baseX + stopperGapX, baseY + stopperGapY, stopperRadius, nonCollisionGroupRef, playerNumber === 'player1'? 'StopperLeftBottom' : 'StopperRightTop');
  const stopperRightBottom = stopper(2 * baseX - stopperGapX, baseY + stopperGapY, stopperRadius, nonCollisionGroupRef, playerNumber === 'player1' ? 'StopperRightBottom' : 'StopperLeftTop');
  const stopperLeftTop = stopper(baseX + stopperGapX, baseY - stopperGapY, stopperRadius, nonCollisionGroupRef, playerNumber === 'player1' ? 'StopperLeftTop' : 'StopperRightBottom');
  const stopperRightTop = stopper(2 * baseX - stopperGapX, baseY - stopperGapY, stopperRadius, nonCollisionGroupRef, playerNumber === 'player1' ? 'StopperRightTop' : 'StopperLeftBottom');
  return [ stopperLeftBottom, stopperRightBottom, stopperLeftTop, stopperRightTop ];
}


const makeJoint = (hingeLeft: Body, hingeRight: Body, paddleLeft: Body, paddleRight: Body) => {
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
}

export function initPlayer(playerNumber:PlayerNumber, cw: number, ch: number, yScale: number, nonCollisionGroupRef: number, hingeGroupRef: number) : Player {
  const xScale = 0.333;
  const [ hingeLeft, hingeRight ] = makeHinge(xScale * cw, yScale * ch, hingeGroupRef);
  const [ paddleLeft, paddleRight ] = makePaddle(xScale * cw, yScale * ch, hingeGroupRef);
  const [ stopperLeftBottom, stopperRightBottom, stopperLeftTop, stopperRightTop ] = makeStopper(playerNumber, xScale * cw, yScale * ch, nonCollisionGroupRef);
  const [ jointLeft, joinRight ] = makeJoint(hingeLeft, hingeRight, paddleLeft, paddleRight);
  return { hingeLeft, hingeRight, paddleLeft, paddleRight, stopperLeftTop, stopperLeftBottom, stopperRightTop, stopperRightBottom, jointLeft, joinRight};
}

const getOwnTarget = (engine: Engine, playerNumber:PlayerNumber, label:string) => {
  const targets = findTargetAll(engine.world, label);
  return playerNumber === 'player1' ? targets[0] : targets[1];
}

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

