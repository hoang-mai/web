// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() userId: number,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = `chat-${userId}`;
    await socket.join(room);
    socket.data.userId = userId;
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: {
      senderId: number;
      receiverId: number;
      content: string;
    },
  ) {
    try {
      const message = await this.chatService.createMessage(
        data.senderId,
        data.receiverId,
        data.content,
      );
      this.server.to(`chat-${data.senderId}`).emit('message', message);
      this.server.to(`chat-${data.receiverId}`).emit('message', message);
    } catch (error) {
      console.error('Error creating message:', error);
      this.server
        .to(`chat-${data.senderId}`)
        .emit('error', 'Đã xảy ra lỗi khi gửi tin nhắn');
    }
  }
}
