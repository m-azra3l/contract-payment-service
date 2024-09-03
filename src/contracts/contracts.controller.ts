import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { Request } from 'express';

@ApiTags('Contracts')
@ApiHeader({
  name: 'profile-id',
  description: 'User profile ID',
  required: true,
})
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by ID' })
  @ApiResponse({ status: 200, description: 'Contract retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async getContractById(@Param('id') id: string, @Req() req: Request) {
    const profileId = Number(req.headers['profile-id']);
    return this.contractsService.getContractById(Number(id), profileId);
  }

  @Get()
  @ApiOperation({ summary: 'Get active contracts' })
  @ApiResponse({
    status: 200,
    description: 'Active contracts retrieved successfully',
  })
  async getActiveContracts(@Req() req: Request) {
    const profileId = Number(req.headers['profile-id']);
    return this.contractsService.getActiveContracts(profileId);
  }
}
