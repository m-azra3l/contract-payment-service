import { ApiProperty } from '@nestjs/swagger';
import { ProfileRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class GetProfileDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ab3cd23e-000a-w752-9df2-61cffa158b23' })
  uuid: string;

  @ApiProperty({ example: 'James' })
  firstName: string;

  @ApiProperty({ example: 'Gun' })
  lastName: string;

  @ApiProperty({ example: 'Consultant' })
  profession: string;

  @ApiProperty({ example: 1500.0 })
  balance: Decimal;

  @ApiProperty({ example: `'client'  'contractor'` })
  role: ProfileRole;

  @ApiProperty({ example: '2024-09-02T22:39:24.093Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-09-02T22:39:24.093Z' })
  updatedAt: Date;
}
