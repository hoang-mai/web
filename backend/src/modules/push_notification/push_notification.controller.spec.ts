import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationController } from './push_notification.controller';
import { PushNotificationService } from './push_notification.service';

describe('PushNotificationController', () => {
  let controller: PushNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushNotificationController],
      providers: [PushNotificationService],
    }).compile();

    controller = module.get<PushNotificationController>(PushNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
