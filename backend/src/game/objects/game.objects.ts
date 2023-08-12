export class Ball {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;

  constructor(
    id: string,
    x = Math.random() * 100,
    y = Math.random() * 100,
    radius = 42,
    color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`,
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
}
