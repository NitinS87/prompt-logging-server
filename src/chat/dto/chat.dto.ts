import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChatCompletionMessageParam } from 'openai/resources';

export class ChatDTO {
  @IsNotEmpty()
  @IsString()
  user: string;

  // Can be empty if the default is set in the config
  @IsOptional()
  @IsString()
  apiKey: string;

  @IsString()
  model: string;

  @IsNotEmpty()
  @IsArray()
  messages: Array<ChatCompletionMessageParam>;
}
