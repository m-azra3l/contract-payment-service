import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';

export class GetContractDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ab3cd23e-000a-w752-9df2-61cffa158b23' })
  uuid: string;

  @ApiProperty({ example: 'Contract for web development' })
  terms: string;

  @ApiProperty({ enum: ContractStatus, example: 'in_progress' })
  status: ContractStatus;

  @ApiProperty({ example: 'John Doe' })
  clientName: string;

  @ApiProperty({ example: 'Jane Smith' })
  contractorName: string;

  @ApiProperty({ example: '2024-09-02T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-09-02T00:00:00Z' })
  updatedAt: Date;
}
