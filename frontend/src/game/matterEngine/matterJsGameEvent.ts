import { Dispatch, SetStateAction } from 'react';
import { Engine, Events, Body, Runner } from 'matter-js';
import { CanvasSize, PlayerNumber } from '@/game/gameType';
import { socketEmitGameBallEvent, socketEmitGameScoreEvent } from '@/context/socketGameEvent';
import { findTarget } from '@/game/matterEngine/matterJsUnit';
import { Score } from '@/game/gameType';

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

export const eventOnCollisionStart = (engine: Engine, runner: Runner, playerNumber: PlayerNumber, setScore: Dispatch<SetStateAction<Score>>) => {
  Events.on(engine, 'collisionStart', (e) => {
    const pairs = e.pairs;
    pairs.forEach((pair) => {
      if (pair.isSensor) {
        if (pair.bodyA.label === 'Ball' || pair.bodyB.label === 'Ball') {
          if (pair.bodyA.label === 'player1' || pair.bodyB.label === 'player1') {
            setScore((prevScore: Score) => { return { p1: prevScore.p1, p2: prevScore.p2 + 1}; });
          } else if (pair.bodyA.label === 'player2' || pair.bodyB.label === 'player2') {
            setScore((prevScore: Score) => { return { p1: prevScore.p1 + 1, p2: prevScore.p2 }; });
          }
        }
      }
    });

    const bodies = e.source.world.bodies;
    bodies.forEach((body: Body)  => {
      if (body.label === 'Ball') {
        socketEmitGameBallEvent(body.position, body.velocity);
      }
    });
  });
};

export const eventOnCollisionEnd = (engine: Engine) => {
  Events.on(engine, 'collisionEnd', (e) => {
    const pairs = e.pairs;
    pairs.forEach((pair) => {
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
