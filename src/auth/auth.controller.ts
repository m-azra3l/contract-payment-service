import { Controller, Get, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @Get('profile')
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiHeader({
    name: 'profile-id',
    description: 'ID of the user profile',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: Request) {
    return req['profile'];
  }
}
