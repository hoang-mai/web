import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationToken } from 'src/entities/notification_token.entity';
import { Role } from 'src/entities/role.enum';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as webPush from 'web-push';
@Injectable()
export class PushNotificationService {
  constructor(
    @Inject('VAPID_KEYS')
    private readonly vapidKeys: { publicKey: string; privateKey: string },
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepository: Repository<NotificationToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    webPush.setVapidDetails(
      'mailto:maianhhoang31072003@gmail.com',
      this.vapidKeys.publicKey,
      this.vapidKeys.privateKey,
    );
  }
  async sendNotificationToUser(
    userId: number,
    payload: string,
  ) {
    const notificationToken = await this.notificationTokenRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!notificationToken) {
      throw new NotFoundException('Notification token not found');
    }

    try {
      const subscription: webPush.PushSubscription = {
        endpoint: notificationToken.endpoint,
        keys: {
          p256dh: notificationToken.p256dh,
          auth: notificationToken.auth,
        },
      };
      await webPush.sendNotification(subscription, payload);
      console.log('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
  async save(subscription: webPush.PushSubscription, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let notificationToken = await this.notificationTokenRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!notificationToken) {
      notificationToken = new NotificationToken();
      notificationToken.user = user;
    }
    console.log('Saving subscription:', subscription);
    notificationToken.endpoint = subscription.endpoint;
    notificationToken.p256dh = subscription.keys?.p256dh || '';
    notificationToken.auth = subscription.keys?.auth || '';
    await this.notificationTokenRepository.save(notificationToken);
  }
  
  async sendNotificationToAdmin(payload: string) {
    const adminUser = await this.userRepository.findOne({
      where: { role: Role.ADMIN },
    });

    if (!adminUser) {
      throw new NotFoundException('Admin user not found');
    }

    await this.sendNotificationToUser(adminUser.id, payload);
  }
}
