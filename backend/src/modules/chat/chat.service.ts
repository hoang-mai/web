import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Message } from 'src/entities/message.entity';
import { Chat } from 'src/entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOrCreateChatBox(userId: string) {
    let chatBox = await this.chatRepository.findOne({
      where: { user: { id: +userId } },
      relations: ['user'],
    });

    if (!chatBox) {
      const user = await this.userRepository.findOneBy({ id: +userId });
      if (!user) {
        throw new Error(`User ID ${userId} không tồn tại`);
      }
      chatBox = this.chatRepository.create({ user });
      await this.chatRepository.save(chatBox);
    }

    return chatBox;
  }

  async getMessagesByChatBoxId(chatBoxId: number) {
    return this.messageRepository.find({
      where: { chat: { id: chatBoxId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async saveMessage(dto: CreateMessageDto) {
    const chat = await this.chatRepository.findOneBy({ id: dto.chatBoxId });
    if (!chat) throw new Error('ChatBox không tồn tại');
    const sender = await this.userRepository.findOneBy({ id: +dto.senderId });
    if (!sender) throw new Error('Người gửi không tồn tại');
    const message = this.messageRepository.create({
      chat,
      sender,
      content: dto.content,
    });
    return await this.messageRepository.save(message);
  }

  async listUserChatBoxes(): Promise<
    {
      id: number;
      user: {
        id: number;
        userName: string;
        email: string;
      };
      latestMessage?: {
        content: string;
        createdAt: Date;
      };
    }[]
  > {
    const chatBoxes = await this.chatRepository.find({
      relations: ['user', 'messages'],
      order: { updatedAt: 'DESC' },
    });

    const result = chatBoxes
      .filter((chat) => chat.messages && chat.messages.length > 0)
      .map((chat) => {
        const latest = [...chat.messages].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

        return {
          id: chat.id,
          user: {
            id: chat.user.id,
            userName: chat.user.firstName + ' ' + chat.user.lastName,
            email: chat.user.email,
          },
          latestMessage: latest
            ? { content: latest.content, createdAt: latest.createdAt }
            : undefined,
        };
      });

    return result;
  }
}
