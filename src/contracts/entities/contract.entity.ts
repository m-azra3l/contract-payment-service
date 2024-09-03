import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';

export class ContractEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Contract for web development' })
  terms: string;

  @ApiProperty({ enum: ContractStatus, example: 'in_progress' })
  status: ContractStatus;

  @ApiProperty({ example: 1 })
  contractorId: number;

  @ApiProperty({ example: 2 })
  clientId: number;

  @ApiProperty({ example: '2024-09-02T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-09-02T00:00:00Z' })
  updatedAt: Date;
}
