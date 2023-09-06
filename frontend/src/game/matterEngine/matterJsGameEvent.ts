import { Engine, Events, Body, Runner } from 'matter-js';
import { CanvasSize, PlayerNumber } from '@/game/gameType';
import { socketEmitGameBallEvent, socketEmitGameScoreEvent } from '@/context/socketGameEvent';
import { findTarget } from '@/game/matterEngine/matterJsUnit';

export const eventOnBeforeUpdate = (engine: Engine) => {
  Events.on(engine, 'beforeUpdate', (e) => {
    // limit Balls max speed
    const bodies = e.source.world.bodies;
    bodies.forEach(body => {
      if (body.label === 'Ball') {
        const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        
        const minVelocity = 5;
        const maxVelocity = 8;
        if (speed > maxVelocity) {
          const ratio = maxVelocity / speed;
          Body.setVelocity(body, { x: body.velocity.x * ratio, y: body.velocity.y * ratio });
        } else if (speed < minVelocity) {
          const ratio = minVelocity / speed;
          Body.setVelocity(body, { x: body.velocity.x * ratio, y: body.velocity.y * ratio });
        }
      } else if (body.label.match(/^Paddle/)) {
        // set limit paddle angular
        if (body.angularVelocity > 0.42) {
          Body.setAngularVelocity(body, 0.42);
        } else if (body.angularVelocity < -0.42) {
          Body.setAngularVelocity(body, -0.42);
        }
      }
    });
  });
};

// const drawCountdown = (sceneSize: CanvasSize, ctx: CanvasRenderingContext2D | null, countdown: number) => {
//   if (!ctx) return;
//   ctx.clearRect(0, 0, sceneSize.width, sceneSize.height);
//
//   ctx.fillStyle = 'black';
//   ctx.font = '30px Arial';
//   ctx.fillText(`${countdown}`, sceneSize.width / 2, sceneSize.height / 2);
// };

export const eventOnCollisionStart = (sceneSize: CanvasSize, engine: Engine, runner: Runner, playerNumber: PlayerNumber) => {
  Events.on(engine, 'collisionStart', (e) => {
    const pairs = e.pairs;
    pairs.forEach(pair => {
      if (pair.isSensor) {
        if (pair.bodyA.label === 'Ball' || pair.bodyB.label === 'Ball') {
          Body.setPosition(findTarget(engine.world, 'Ball'), { x: sceneSize.width / 2, y: sceneSize.height / 2});
          Body.setStatic(findTarget(engine.world, 'Ball'), true);
          socketEmitGameScoreEvent(playerNumber, pair.bodyA.label === 'Ball' ? pair.bodyB.label : pair.bodyA.label);
        }
      }
    });
    const bodies = e.source.world.bodies;
    bodies.forEach(body => {
      if (body.label === 'Ball') {
        socketEmitGameBallEvent(body.position, body.velocity);
      }
    });
  });
};

export const eventOnCollisionEnd = (engine: Engine) => {
  Events.on(engine, 'collisionEnd', (e) => {
    const pairs = e.pairs;
    pairs.forEach(pair => {
      // BottomStopper 와 Paddle 충돌 시 Paddle 의 Velocity, AngularVelocity 0으로 설정하는 이벤트
      if (pair.bodyA.label.match(/^Paddle/) && pair.bodyB.label.match(/^Stopper(.)*Bottom$/)) {
        Body.setVelocity(pair.bodyA, { x: 0, y: 0 });
        Body.setAngularVelocity(pair.bodyA, 0);
      }
      if (pair.bodyB.label.match(/^Paddle/) && pair.bodyA.label.match(/^Stopper(.)*Bottom$/)) {
        Body.setVelocity(pair.bodyB, { x: 0, y: 0 });
        Body.setAngularVelocity(pair.bodyB, 0);
      }
    });
  });
};
