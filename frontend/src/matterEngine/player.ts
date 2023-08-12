import { Constraint, Body, Engine } from 'matter-js';
import { stopper, hinge, paddle } from './matterJsUnit';

type player = {
    hingeLeft: Matter.Body;
    hingeRight: Matter.Body;
    paddleLeft: Matter.Body;
    paddleRight: Matter.Body;
    stopperLeftTop: Matter.Body;
    stopperLeftBottom: Matter.Body;
    stopperRightTop: Matter.Body;
    stopperRightBottom: Matter.Body;
    jointLeft: Matter.Constraint;
    joinRight: Matter.Constraint;
}

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
  Body.set;

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

export const movePlayer = (engine: Engine, dx: number) => {
  const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
  const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
  const StopperLeftTop = engine.world.bodies.find(body => body.label === 'StopperLeftTop') as Matter.Body;
  const StopperRightTop = engine.world.bodies.find(body => body.label === 'StopperRightTop') as Matter.Body;
  const StopperLeftBottom = engine.world.bodies.find(body => body.label === 'StopperLeftBottom') as Matter.Body;
  const StopperRightBottom = engine.world.bodies.find(body => body.label === 'StopperRightBottom') as Matter.Body;
  const hingeLeft = engine.world.bodies.find(body => body.label === 'HingeLeft') as Matter.Body;
  const hingeRight = engine.world.bodies.find(body => body.label === 'HingeRight') as Matter.Body;
    
  if (!paddleLeft || !paddleRight || !StopperLeftTop || !StopperRightTop || !StopperLeftBottom || !StopperRightBottom || !hingeLeft || !hingeRight) return;
  Body.translate(paddleLeft, { x: dx, y: 0 });
  Body.translate(paddleRight, { x: dx, y: 0 });
  Body.translate(StopperLeftTop, { x: dx, y: 0 });
  Body.translate(StopperRightTop, { x: dx, y: 0 });
  Body.translate(StopperLeftBottom, { x: dx, y: 0 });
  Body.translate(StopperRightBottom, { x: dx, y: 0 });
  Body.translate(hingeLeft, { x: dx, y: 0 });
  Body.translate(hingeRight, { x: dx, y: 0 });
};

export const movePaddleKeyDown = (engine: Engine, rad: number) => {
    
  const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
  const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
  if (!paddleLeft || !paddleRight) return;
  // setVelocity, applyForce
  console.log('down');
  Body.setAngularVelocity(paddleLeft, -1);
  Body.setAngularVelocity(paddleRight, 1);
};

export const movePaddleKeyUp = (engine: Engine, rad: number) => {
  const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
  const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
  if (!paddleLeft || !paddleRight) return;
  // setVelocity, applyForce
  console.log('up');
  Body.setAngularVelocity(paddleLeft, 1);
  Body.setAngularVelocity(paddleRight, -1);
  
  console.log('left sp   ', paddleLeft);
  console.log('\nright sp ', paddleRight.velocity);
};

export const movePaddleKeyRotate = (body: Body, direction: number) => {
  Body.setAngularVelocity(body, direction);
};
