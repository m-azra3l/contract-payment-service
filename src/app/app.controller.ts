import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check if server is up' })
  @ApiResponse({ status: 200, description: '<h1>Healthy🎉🎊</h1>' })
  getHealth(): string {
    return this.appService.getHealth();
  }
}
