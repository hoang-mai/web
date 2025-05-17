import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';
import { Role } from 'src/entities/role.enum';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findOrCreateChat(userId: number, adminId: number): Promise<Chat> {
    let chat = await this.chatRepo.findOne({
      where: { user: { id: userId }, admin: { id: adminId } },
      relations: ['user', 'admin'],
    });

    if (!chat) {
      const user = await this.userRepo.findOneBy({ id: userId });
      const admin = await this.userRepo.findOneBy({ id: adminId });
      if (!user || !admin) throw new Error('User or Admin not found');

      chat = this.chatRepo.create({ user, admin });
      await this.chatRepo.save(chat);
    }
    return chat;
  }

  async createMessage(senderId: number, receiverId: number, content: string) {
    const sender = await this.userRepo.findOneBy({ id: senderId });
    const receiver = await this.userRepo.findOneBy({ id: receiverId });
    if (!sender || !receiver)
      throw new Error('Không tìm thấy người dùng hoặc Quản trị viên');

    const isSenderAdmin = sender.role === Role.ADMIN;
    const isReceiverAdmin = receiver.role === Role.USER;
    if (isSenderAdmin === isReceiverAdmin)
      throw new Error('Chỉ có thể gửi tin nhắn với Quản trị viên');

    const user = isSenderAdmin ? receiver : sender;
    const admin = isSenderAdmin ? sender : receiver;

    const chat = await this.findOrCreateChat(user.id, admin.id);
    const message = this.msgRepo.create({ chat, sender, content });
    return await this.msgRepo.save(message);
  }
}
