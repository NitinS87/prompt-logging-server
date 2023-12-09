import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDTO } from './dto';
import { ChatCompletion } from 'openai/resources';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getHello(): string {
    return this.chatService.getHello();
  }

  @HttpCode(HttpStatus.OK)
  @Post('send')
  async sendMessage(@Body() dto: ChatDTO): Promise<ChatCompletion> {
    return await this.chatService.sendMessage(dto);
  }
}
