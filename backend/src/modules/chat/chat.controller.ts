import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('init')
  async initChat(@Body('userId') userId: string) {
    const chatBox = await this.chatService.getOrCreateChatBox(userId);
    return { chatBoxId: chatBox.id };
  }

  @Get(':chatBoxId/messages')
  async getMessages(@Param('chatBoxId') chatBoxId: number) {
    return this.chatService.getMessagesByChatBoxId(chatBoxId);
  }

  @Get('list-user-chat-boxes')
  async listChatBoxes() {
    return await this.chatService.listUserChatBoxes();
  }
}
