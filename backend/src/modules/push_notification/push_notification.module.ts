import { Module } from '@nestjs/common';
import { PushNotificationService } from './push_notification.service';
import { PushNotificationController } from './push_notification.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationToken } from 'src/entities/notification_token.entity';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  imports: [
    TypeOrmModule.forFeature([NotificationToken, User]),
    ConfigModule,
    NotificationToken,
    User,
  ],
})
export class PushNotificationModule {}
