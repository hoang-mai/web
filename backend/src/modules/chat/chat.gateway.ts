import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173/' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  private adminSockets: Map<string, Socket> = new Map();
  private userRooms: Map<string, string> = new Map();
  private socketRoles: Map<string, { userId: string; role: string }> =
    new Map();

  handleConnection(socket: Socket) {}

  handleDisconnect(socket: Socket) {
    const user = this.socketRoles.get(socket.id);
    if (user?.role === 'admin') {
      this.adminSockets.delete(user.userId);
    }
    this.userRooms.delete(socket.id);
    this.socketRoles.delete(socket.id);
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() { userId, role }: { userId: string; role: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.socketRoles.set(socket.id, { userId, role });

    if (role === 'admin') {
      this.adminSockets.set(userId, socket);
    }
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() { chatBoxId }: { chatBoxId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    await socket.join(`${chatBoxId}`);
    this.userRooms.set(socket.id, `${chatBoxId}`);

    for (const adminSocket of this.adminSockets.values()) {
      await adminSocket.join(`${chatBoxId}`);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const newMessage = await this.chatService.saveMessage(message);

      this.server.to(`${message.chatBoxId}`).emit('message', {
        chatBoxId: message.chatBoxId,
        senderId: message.senderId,
        content: message.content,
      });
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      socket.emit('error', 'Gửi tin nhắn thất bại');
    }
  }
}
