import { IsOptional, IsString } from 'class-validator';

export class DashboardDto {
  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  latency?: string;

  @IsOptional()
  @IsString()
  days?: string;
}
