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

export function initPlayer(cw: number, ch: number, yScale: number, nonCollisionGroupRef: number) : player {
    const xScale = 0.333;

    // hinge
    const hingeLeft = hinge(xScale * cw - 20, yScale * ch, 5, 'HingeLeft');
    const hingeRight = hinge(2 * xScale * cw + 20, yScale * ch, 5, 'HingeRight');
    const paddleLeft = paddle(xScale * cw, yScale * ch, 50, 20, 'PaddleLeft');
    const paddleRight = paddle(2 * xScale * cw, yScale * ch, 50, 20, 'PaddleRight');

    // paddle stopper
    const stopperRadius = 20;
    const stopperGapY = 40;
    const stopperGapX = 10;

    const stopperLeftBottom = stopper(xScale * cw + stopperGapX, yScale * ch + stopperGapY, stopperRadius, nonCollisionGroupRef, 'PaddleLeftBottomStopper');
    const stopperLeftTop = stopper(xScale * cw + stopperGapX, yScale * ch - stopperGapY, stopperRadius, nonCollisionGroupRef, 'PaddleLeftTopStopper');
    const stopperRightBottom = stopper(2 * xScale * cw - stopperGapX, yScale * ch + stopperGapY, stopperRadius, nonCollisionGroupRef, 'PaddleRightBottomStopper');
    const stopperRightTop = stopper(2 * xScale * cw - stopperGapX, yScale * ch - stopperGapY, stopperRadius, nonCollisionGroupRef, 'PaddleRightTopStopper');
    const jointLeft = Constraint.create({
        bodyA: hingeLeft,
        bodyB: paddleLeft,
        pointA: { x: 0, y: 0 },
        pointB: { x: -25, y: 0 },
        stiffness: 1,
        length: 0
      });
      const joinRight = Constraint.create({
        bodyA: hingeRight,
        bodyB: paddleRight,
        pointA: { x: 0, y: 0 },
        pointB: { x: 25, y: 0 },
        stiffness: 1,
        length: 0
      });
    return { hingeLeft, hingeRight, paddleLeft, paddleRight, stopperLeftTop, stopperLeftBottom, stopperRightTop, stopperRightBottom, jointLeft, joinRight};
}

export const movePlayer = (engine: Engine, dx: number) => {
    const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
    const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
    const paddleLeftTopStopper = engine.world.bodies.find(body => body.label === 'PaddleLeftTopStopper') as Matter.Body;
    const paddleRightTopStopper = engine.world.bodies.find(body => body.label === 'PaddleRightTopStopper') as Matter.Body;
    const paddleLeftBottomStopper = engine.world.bodies.find(body => body.label === 'PaddleLeftBottomStopper') as Matter.Body;
    const paddleRightBottomStopper = engine.world.bodies.find(body => body.label === 'PaddleRightBottomStopper') as Matter.Body;
    const hingeLeft = engine.world.bodies.find(body => body.label === 'HingeLeft') as Matter.Body;
    const hingeRight = engine.world.bodies.find(body => body.label === 'HingeRight') as Matter.Body;
    
    if (!paddleLeft || !paddleRight || !paddleLeftTopStopper || !paddleRightTopStopper || !paddleLeftBottomStopper || !paddleRightBottomStopper || !hingeLeft || !hingeRight) return;
    Body.translate(paddleLeft, { x: dx, y: 0 });
    Body.translate(paddleRight, { x: dx, y: 0 });
    Body.translate(paddleLeftTopStopper, { x: dx, y: 0 });
    Body.translate(paddleRightTopStopper, { x: dx, y: 0 });
    Body.translate(paddleLeftBottomStopper, { x: dx, y: 0 });
    Body.translate(paddleRightBottomStopper, { x: dx, y: 0 });
    Body.translate(hingeLeft, { x: dx, y: 0 });
    Body.translate(hingeRight, { x: dx, y: 0 });
  };

export const movePaddleKeyDown = (engine: Engine, rad: number) => {
    const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
    const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
    if (!paddleLeft || !paddleRight) return;
    // setVelocity, applyForce
    console.log("down");
    Body.setAngularVelocity(paddleLeft, -2);
    Body.setAngularVelocity(paddleRight, 2);
};

export const movePaddleKeyUp = (engine: Engine, rad: number) => {
  const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
  const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
  if (!paddleLeft || !paddleRight) return;
  // setVelocity, applyForce
  console.log("up");
  Body.setAngularVelocity(paddleLeft, 5);
  Body.setAngularVelocity(paddleRight, -5);
  
  console.log("left sp   ",paddleLeft);
  console.log("\nright sp ",paddleRight.velocity);
};