import { Test, TestingModule } from '@nestjs/testing';
import { Google2faController } from './google2fa.controller';

describe('Google2faController', () => {
  let controller: Google2faController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Google2faController],
    }).compile();

    controller = module.get<Google2faController>(Google2faController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
