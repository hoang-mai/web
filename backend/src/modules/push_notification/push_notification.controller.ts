import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { PushNotificationService } from './push_notification.service';
import { PushSubscription } from 'web-push';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  subscribe(@Body() body: { subscription: PushSubscription }, @Request() req: any) {
    console.log('New subscription:', body.subscription);
    this.pushNotificationService.save(body.subscription , req.user.id);
    return { message: 'Đăng ký thành công' };
  }

  @Post('notify')
  @UseGuards(JwtAuthGuard)
  async notifyAll(@Body() body: { title: string; body: string }, @Request() req: any) {
    const payload =
      '{"title": "' + body.title + '", "body": "' + body.body + '"}';
    await this.pushNotificationService.sendNotificationToUser(req.user.id, payload);
    return { message: 'Notifications sent' };
  }

  @Post('notify-admin')
  async notifyAdmin(@Body() body: { title: string; body: string }) {
    const payload =
      '{"title": "' + body.title + '", "body": "' + body.body + '"}';
    await this.pushNotificationService.sendNotificationToAdmin(payload);
    return { message: 'Notifications sent to admin' };
  }
}
