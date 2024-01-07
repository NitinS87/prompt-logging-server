import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDTO } from './dto';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getHello(): string {
    return this.chatService.getHello();
  }

  @HttpCode(HttpStatus.OK)
  @Post('send')
  async sendMessage(@Body() dto: ChatDTO, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const completion = await this.chatService.sendMessage(dto);
    for await (const chunk of completion) {
      console.log('DEBUG >>> ', chunk.choices[0].delta.content);
      if (chunk.choices[0].delta.content === undefined) {
        break;
      }

      res.write(chunk.choices[0].delta.content);
    }

    res.end();
  }

  @Get('stream')
  async getStream(@Res() response: Response): Promise<void> {
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    const intervalId = setInterval(() => {
      const data = new Date().toISOString();
      response.write(`${data}\n`);
    }, 500);

    // Close the connection after 10 seconds
    setTimeout(() => {
      clearInterval(intervalId);
      response.end();
    }, 10000);
  }
}
