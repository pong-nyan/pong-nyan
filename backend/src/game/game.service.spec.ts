import { Test } from '@nestjs/testing';
import { GameService } from './game.service';

// TODO: sepeat test for each function
describe('GameService', () => {
  let service: GameService;

  beforeAll(async() => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [GameService],
    }).compile();

    service = await moduleRef.resolve(GameService);
  });

  beforeEach(async () => {
    service.balls.push({
      id: 'test', x: 0, y: 0, radius: 0,
      color: 'red'
    });
  });

  afterEach(() => {
  });

  afterAll(() => {
    console.log('afterAll');
  });

  it('addBall should add a ball to the balls array', () => {
    const beforeCnt = service.balls.length;
    service.addBall('test');
    expect(service.balls.length).toBe(beforeCnt + 1);
  });

  it('removeBall should remove a ball from the balls array', () => {
    service.removeBall('test');
    expect(service.balls.length).toBe(0);
  });

  it('moveBall should move the ball', () => {
    // TODO: no hard coding
    service.moveBall('ArrowUp', 'test');
    expect(service.balls[0].y).toBe(-5);
    service.moveBall('ArrowDown', 'test');
    expect(service.balls[0].y).toBe(0);
    service.moveBall('ArrowLeft', 'test');
    expect(service.balls[0].x).toBe(-5);
    service.moveBall('ArrowRight', 'test');
    expect(service.balls[0].x).toBe(0);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
