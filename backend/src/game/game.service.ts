import { Injectable } from '@nestjs/common';
import { Ball } from './objects/game.objects';

@Injectable()
export class GameService {
  balls: Ball[] = [];
  moveBall(keyCode: string, socketId: string) {
    const myBall = this.getMyBall(socketId);
    switch (keyCode) {
      case 'ArrowUp':
        myBall.y -= 5;
        break;
      case 'ArrowDown':
        myBall.y += 5;
        break;
      case 'ArrowLeft':
        myBall.x -= 5;
        break;
      case 'ArrowRight':
        myBall.x += 5;
        break;
      default:
        break;
    }
  }

  addBall(socketId: string) {
    this.balls.push(new Ball(socketId));
  }

  removeBall(socketId: string) {
    this.balls = this.balls.filter((ball) => ball.id !== socketId);
  }
  private getMyBall(socketId: string) {
    return this.balls.find((ball) => ball.id === socketId);
  }

  //TODO: detect window collision
  //modify moveBall to check for collision
  private isCollision(ball: Ball) {
    const collision = this.balls.find(
      (b) =>
        b.id !== ball.id &&
        Math.sqrt(Math.pow(b.x - ball.x, 2) + Math.pow(b.y - ball.y, 2)) <
        b.radius + ball.radius,
    );
    return !!collision;
  }

}
