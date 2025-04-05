import { Inject, Injectable } from '@nestjs/common';
import * as webPush from 'web-push';
@Injectable()
export class PushNotificationService {
  constructor(
    @Inject('VAPID_KEYS')
    private readonly vapidKeys: { publicKey: string; privateKey: string },
  ) {
    webPush.setVapidDetails(
      'mailto:your@email.com',
      this.vapidKeys.publicKey,
      this.vapidKeys.privateKey,
    );
  }
  async sendNotification(
    subscription: webPush.PushSubscription,
    payload: string,
  ) {
    try {
      await webPush.sendNotification(subscription, payload);
      console.log('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
