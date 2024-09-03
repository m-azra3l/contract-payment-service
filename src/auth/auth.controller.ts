import { Controller, Get, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GetProfileDto } from './dto/get-profile.dto';

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
    type: GetProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: Request) {
    return req['profile'];
  }
}
