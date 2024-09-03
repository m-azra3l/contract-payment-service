import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { Request } from 'express';
import { GetUnpaidJobsDto } from './dto/get-unpaid-jobs.dto';

@ApiTags('Jobs')
@ApiHeader({
  name: 'profile-id',
  description: 'User profile ID',
  required: true,
})
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('unpaid')
  @ApiOperation({ summary: 'Get all unpaid jobs for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Unpaid jobs retrieved successfully',
    type: [GetUnpaidJobsDto],
  })
  async getUnpaidJobs(@Req() req: Request) {
    const profileId = Number(req.headers['profile-id']);
    return this.jobsService.getUnpaidJobs(profileId);
  }

  @Post(':job_id/pay')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Pay for a job' })
  @ApiResponse({ status: 204, description: 'Payment processed successfully' })
  @ApiResponse({
    status: 403,
    description: 'Insufficient balance or unauthorized',
  })
  async payForJob(@Param('job_id') jobId: string, @Req() req: Request) {
    const profileId = Number(req.headers['profile-id']);
    await this.jobsService.payForJob(Number(jobId), profileId);
  }
}
