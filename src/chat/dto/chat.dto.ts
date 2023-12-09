import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ChatCompletionMessageParam } from 'openai/resources';

export class ChatDTO {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsString()
  apiKey: string;

  @IsString()
  model: string;

  @IsNotEmpty()
  @IsArray()
  messages: Array<ChatCompletionMessageParam>;
}
