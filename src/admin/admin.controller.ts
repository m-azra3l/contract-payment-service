import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { BestClientDto } from './dto/best-client.dto';

class BestProfessionDto {
  @ApiProperty({
    description: 'The best profession',
    example: 'Contractor',
  })
  profession: string | null;
}

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('best-profession')
  @ApiOperation({
    summary:
      'Get the profession that earned the most money within a specific period',
  })
  @ApiResponse({
    status: 200,
    description: 'Best profession retrieved successfully',
    type: BestProfessionDto,
  })
  async getBestProfession(
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<object> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.adminService.getBestProfession(startDate, endDate);
  }

  @Get('best-clients')
  @ApiOperation({
    summary: 'Get the clients who paid the most within a specific period',
  })
  @ApiResponse({
    status: 200,
    description: 'Best clients retrieved successfully',
    type: [BestClientDto],
  })
  async getBestClients(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('limit') limit: string = '2',
  ): Promise<BestClientDto[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.adminService.getBestClients(startDate, endDate, Number(limit));
  }
}
