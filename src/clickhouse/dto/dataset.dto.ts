import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsObject } from 'class-validator';

class MetaDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}

class DataDto {
  @IsString()
  user: string;

  @IsString()
  status: string;

  @IsString()
  request: string;

  @IsString()
  response: string;

  @IsString()
  model: string;

  @IsNumber()
  prompt_tokens: number;

  @IsNumber()
  completion_tokens: number;

  @IsNumber()
  total_tokens: number;

  @IsNumber()
  latency: number;

  @IsString()
  created_at: string;
}

class StatisticsDto {
  @IsNumber()
  elapsed: number;

  @IsNumber()
  rows_read: number;

  @IsNumber()
  bytes_read: number;
}

export class DataSetDto {
  @IsArray()
  @Type(() => MetaDto)
  meta: MetaDto[];

  @IsArray()
  @Type(() => DataDto)
  data: DataDto[];

  @IsNumber()
  rows: number;

  @IsNumber()
  rows_before_limit_at_least: number;

  @IsObject()
  @Type(() => StatisticsDto)
  statistics: StatisticsDto;
}
