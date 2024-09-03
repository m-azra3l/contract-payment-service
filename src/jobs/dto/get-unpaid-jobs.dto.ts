import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class GetUnpaidJobsDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ab3cd23e-000a-w752-9df2-61cffa158b23' })
  uuid: string;

  @ApiProperty({ example: 'Develop new feature' })
  description: string;

  @ApiProperty({ example: 500 })
  price: Decimal;

  @ApiProperty({ example: false })
  isPaid: boolean;

  @ApiProperty({ example: 1 })
  contractId: number;

  @ApiProperty({ example: 'in_progress' })
  contractStatus: ContractStatus | string;

  @ApiProperty({ example: 'John Doe' })
  clientName: string;

  @ApiProperty({ example: 'Jane Smith' })
  contractorName: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-02T00:00:00Z' })
  updatedAt: Date;
}
