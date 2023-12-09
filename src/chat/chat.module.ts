import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import OpenAI from 'openai';

@Module({
  providers: [ChatService, OpenAI],
  controllers: [ChatController],
})
export class ChatModule {}
