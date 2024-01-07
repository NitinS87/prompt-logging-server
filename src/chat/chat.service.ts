import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatDTO } from './dto';

@Injectable()
export class ChatService {
  constructor(private openai: OpenAI) {}

  getHello(): string {
    return 'Hello World!';
  }

  async sendMessage(dto: ChatDTO) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await this.openai.chat.completions.create({
      model: process.env.OPENAI_DEFAULT_MODEL,
      messages: dto.messages,
      stream: true,
    });

    return completion;
  }
}
