import {
  Controller,
  Param,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { BalancesService } from './balances.service';
import { Request } from 'express';

class DepositDto {
  @ApiProperty({
    description: 'The amount of money to deposit',
    example: 100,
  })
  amount: number;
}

@ApiTags('Balances')
@ApiHeader({
  name: 'profile-id',
  description: 'User profile ID',
  required: true,
})
@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Post('deposit/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deposit money into client balance' })
  @ApiResponse({ status: 204, description: 'Deposit processed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Deposit exceeds 25% of total outstanding payments',
  })
  async deposit(
    @Param('userId') userId: string,
    @Body() depositDto: DepositDto,
    @Req() req: Request,
  ) {
    const profileId = Number(req.headers['profile-id']);
    if (profileId !== Number(userId)) {
      throw new ForbiddenException(
        'You can only deposit into your own account',
      );
    }
    await this.balancesService.depositToClient(
      Number(userId),
      depositDto.amount,
    );
  }
}
