import { Constraint, Body, Engine } from 'matter-js';
import { stopper, hinge, paddle, findTargetAll } from './matterJsUnit';
import { Colision, CollisionEvent, GameEvent, KeyDownEvent, KeyUpEvent, player, PlayerNumber } from '../type';
import { socket } from '@/context/socket';

export function initPlayer(cw: number, ch: number, yScale: number, nonCollisionGroupRef: number, hingeGroupRef: number) : player {
  const xScale = 0.333;

  // hinge
  const paddleWidth = 0.15 * cw;
  const hingeLeft = hinge(xScale * cw - 20, yScale * ch, 5, 'HingeLeft', hingeGroupRef);
  const hingeRight = hinge(2 * xScale * cw + 20, yScale * ch, 5, 'HingeRight', hingeGroupRef);
  const paddleLeft = paddle(xScale * cw * 0.0001, yScale * ch, paddleWidth, 20, 'PaddleLeft', hingeGroupRef);
  const paddleRight = paddle(2 * xScale * cw, yScale * ch, paddleWidth, 20, 'PaddleRight', hingeGroupRef);

  Body.setCentre(paddleLeft, { x: -paddleWidth / 2, y: 0}, true);
  Body.setCentre(paddleRight, { x: paddleWidth / 2, y: 0}, true);

  // paddle stopper
  const stopperRadius = 50;
  const stopperGapY = 65;
  const stopperGapX = -40;

  const stopperLeftBottom = stopper(xScale * cw + stopperGapX, yScale * ch + stopperGapY, stopperRadius, nonCollisionGroupRef, 'StopperLeftBottom');
  const stopperLeftTop = stopper(xScale * cw + stopperGapX, yScale * ch - stopperGapY, stopperRadius, nonCollisionGroupRef, 'StopperLeftTop');
  const stopperRightBottom = stopper(2 * xScale * cw - stopperGapX, yScale * ch + stopperGapY, stopperRadius, nonCollisionGroupRef, 'StopperRightBottom');
  const stopperRightTop = stopper(2 * xScale * cw - stopperGapX, yScale * ch - stopperGapY, stopperRadius, nonCollisionGroupRef, 'StopperRightTop');
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
  return { hingeLeft, hingeRight, paddleLeft, paddleRight, stopperLeftTop, stopperLeftBottom, stopperRightTop, stopperRightBottom, jointLeft, joinRight};
}


export const movePlayer = (engine: Engine, playerNumber: PlayerNumber, dx: number) => {


  const paddleLefts = findTargetAll(engine.world, 'PaddleLeft');
  const paddleRights = findTargetAll(engine.world, 'PaddleRight');
  const stopperLeftTops = findTargetAll(engine.world, 'StopperLeftTop');
  const stopperRightTops = findTargetAll(engine.world, 'StopperRightTop');
  const stopperLeftBottoms = findTargetAll(engine.world, 'StopperLeftBottom');
  const stopperRightBottoms = findTargetAll(engine.world, 'StopperRightBottom');
  const hingeLefts = findTargetAll(engine.world, 'HingeLeft');
  const hingeRights = findTargetAll(engine.world, 'HingeRight');

  const paddleLeft = playerNumber === 'player1' ? paddleLefts[0] : paddleLefts[1];
  const paddleRight = playerNumber === 'player1' ? paddleRights[0] : paddleRights[1];
  const StopperLeftTop = playerNumber === 'player1' ? stopperLeftTops[0] : stopperLeftTops[1];
  const StopperRightTop = playerNumber === 'player1' ? stopperRightTops[0] : stopperRightTops[1];
  const StopperLeftBottom = playerNumber === 'player1' ? stopperLeftBottoms[0] : stopperLeftBottoms[1];
  const StopperRightBottom = playerNumber === 'player1' ? stopperRightBottoms[0] : stopperRightBottoms[1];
  const hingeLeft = playerNumber === 'player1' ? hingeLefts[0] : hingeLefts[1];
  const hingeRight = playerNumber === 'player1' ? hingeRights[0] : hingeRights[1];

  // old part
  // const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
  // const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
  // const StopperLeftTop = engine.world.bodies.find(body => body.label === 'StopperLeftTop') as Matter.Body;
  // const StopperRightTop = engine.world.bodies.find(body => body.label === 'StopperRightTop') as Matter.Body;
  // const StopperLeftBottom = engine.world.bodies.find(body => body.label === 'StopperLeftBottom') as Matter.Body;
  // const StopperRightBottom = engine.world.bodies.find(body => body.label === 'StopperRightBottom') as Matter.Body;
  // const hingeLeft = engine.world.bodies.find(body => body.label === 'HingeLeft') as Matter.Body;
  // const hingeRight = engine.world.bodies.find(body => body.label === 'HingeRight') as Matter.Body;
    
  if (!paddleLeft || !paddleRight 
      || !StopperLeftTop || !StopperRightTop || !StopperLeftBottom || !StopperRightBottom 
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
  const paddleLefts = findTargetAll(engine.world, 'PaddleLeft');
  const paddleRights = findTargetAll(engine.world, 'PaddleRight');
  const paddleLeft = playerNumber === 'player1' ? paddleLefts[0] : paddleLefts[1];
  const paddleRight = playerNumber === 'player1' ? paddleRights[0] : paddleRights[1];

  // const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
  // const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
  if (!paddleLeft || !paddleRight) return;
  velocity = playerNumber === 'player1' ? velocity : -velocity;
  Body.setAngularVelocity(paddleLeft, -velocity);
  Body.setAngularVelocity(paddleRight, velocity);
};

// export const movePaddleKeyUp = (engine: Engine, velocity: number) => {
//     // TODO: 함수 제안
//     // const bar = findTarget(engine.world, 'bar');
//     // movePaddleKeyRotate(bar, step / 100);
//   const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
//   const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
//   if (!paddleLeft || !paddleRight) return;
//   Body.setAngularVelocity(paddleLeft, velocity);
//   Body.setAngularVelocity(paddleRight, -velocity);
// };

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
