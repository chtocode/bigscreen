import { Test, TestingModule } from '@nestjs/testing';
import { RescueController } from './rescue.controller';

describe('RescueController', () => {
  let controller: RescueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RescueController],
    }).compile();

    controller = module.get<RescueController>(RescueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
