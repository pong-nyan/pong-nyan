import { Drawable } from '../interfaces/Drawable';
import { Ball } from '../interfaces/Ball';

export default class DrawableBall implements Drawable, Ball {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  constructor(id: string, x: number, y: number, radius: number, color: string) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}