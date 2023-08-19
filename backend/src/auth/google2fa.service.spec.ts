import { Test, TestingModule } from '@nestjs/testing';
import { Google2faService } from './google2fa.service';

describe('Google2faService', () => {
  let service: Google2faService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Google2faService],
    }).compile();

    service = module.get<Google2faService>(Google2faService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
