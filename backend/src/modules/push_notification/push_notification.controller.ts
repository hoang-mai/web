import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationService } from './push_notification.service';
import { PushSubscription } from 'web-push';
@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}
  private readonly subscriptions: PushSubscription[] = [];
  @Post('subscribe')
  subscribe(@Body() body: { subscription: PushSubscription }) {
    this.subscriptions.push(body.subscription);
    return { message: 'Đăng ký thành công' };
  }

  @Post('notify')
  async notifyAll(@Body() body: { title: string; body: string }) {
    const payload =
      '{"title": "' + body.title + '", "body": "' + body.body + '"}';
    for (const sub of this.subscriptions) {
      await this.pushNotificationService
        .sendNotification(sub, payload)
        .catch(console.error);
    }
    return { message: 'Notifications sent' };
  }
}
