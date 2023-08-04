import { Bodies, Constraint, Body, Engine } from 'matter-js';

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

export function initPlayer(cw: number, ch: number, nonCollisionGroupRef: number) : player {
    const hingeLeft = Bodies.rectangle(0.3 * cw , 0.94 * ch, 10, 10, { isStatic: true, label: 'HingeLeft' ,render: { visible: true }});
    const hingeRight = Bodies.rectangle(0.6 * cw, 0.94 * ch, 10, 10, { isStatic: true, label: 'HingeRight',render: { visible: true }});
    const paddleLeft = Bodies.rectangle(0.3 * cw + 25, 0.94 * ch, 50, 20, { isStatic: false, label: 'PaddleLeft', render: { visible: true }});
    const paddleRight = Bodies.rectangle(0.6 * cw - 25, 0.94 * ch, 50, 20, { isStatic: false, label: 'PaddleRight', render: { visible: true }});
    // paddle stopper
    const stopperRadius = 20;
    const stopperGapY = 40;
    const stopperGapX = 10;
    const stopperLeftTop = Bodies.circle(0.3 * cw + stopperGapX, 0.94 * ch + stopperGapY, stopperRadius,  { isStatic: true, collisionFilter: { group: nonCollisionGroupRef }, label: 'PaddleLeftTopStopper', render: { visible: true }});
    const stopperLeftBottom = Bodies.circle(0.6 * cw - stopperGapX, 0.94 * ch + stopperGapY, stopperRadius, { isStatic: true, collisionFilter: { group: nonCollisionGroupRef }, label: 'PaddleRightTopStopper', render: { visible: true }});
    const stopperRightTop = Bodies.circle(0.3 * cw + stopperGapX, 0.94 * ch - stopperGapY, stopperRadius, { isStatic: true, collisionFilter: { group: nonCollisionGroupRef }, label: 'PaddleLeftBottomStopper', render: { visible: true }});
    const stopperRightBottom = Bodies.circle(0.6 * cw - stopperGapX, 0.94 * ch - stopperGapY, stopperRadius, { isStatic: true, collisionFilter: { group: nonCollisionGroupRef }, label: 'PaddleRightBottomStopper', render: { visible: true }});
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

export const movePaddle = (engine: Engine, rad: number) => {
    const paddleLeft = engine.world.bodies.find(body => body.label === 'PaddleLeft') as Matter.Body;
    const paddleRight = engine.world.bodies.find(body => body.label === 'PaddleRight') as Matter.Body;
    if (!paddleLeft || !paddleRight) return;
    Body.applyForce(paddleLeft, paddleLeft.position, { x: 0, y: -0.01 });
    Body.applyForce(paddleRight, paddleRight.position, { x: 0, y: -0.01 });
    setTimeout(() => {
        Body.setAngle(paddleLeft, -0.3);
        Body.setAngle(paddleRight, 0.3);
    }, 100);
};