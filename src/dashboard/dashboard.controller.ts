import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { DashboardDto } from './dto';
import { DashboardService } from './dashboard.service';
import { QueryDto } from './dto/query.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @HttpCode(HttpStatus.OK)
  @Post('getData')
  async getData(@Body() data: DashboardDto, @Query() queryDto: QueryDto) {
    return await this.dashboardService.getData(
      data,
      Number(queryDto.page),
      Number(queryDto.limit),
    );
  }
}
