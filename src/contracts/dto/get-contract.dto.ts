import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';

export class GetContractDto {
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
}
