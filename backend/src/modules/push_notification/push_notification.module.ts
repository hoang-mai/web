import { Module } from '@nestjs/common';
import { PushNotificationService } from './push_notification.service';
import { PushNotificationController } from './push_notification.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [PushNotificationController],
  providers: [
    PushNotificationService,
    {
      provide: 'VAPID_KEYS',
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('VAPID_PUBLIC_KEY'),
        privateKey: configService.get<string>('VAPID_PRIVATE_KEY'),
      }),
      inject: [ConfigService],
    },
  ],
  imports: [ConfigModule],
})
export class PushNotificationModule {}
