import { Test, TestingModule } from '@nestjs/testing';
import { UserMapService } from './user.map.service';

describe('UserService', () => {
  let service: UserMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMapService],
    }).compile();

    service = module.get<UserMapService>(UserMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
