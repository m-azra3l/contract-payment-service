import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractStatus } from '@prisma/client';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async getContractById(id: number, profileId: number) {
    const contract = await this.prisma.contract.findFirst({
      where: {
        id,
        OR: [{ clientId: profileId }, { contractorId: profileId }],
      },
    });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return contract;
  }

  async getActiveContracts(profileId: number) {
    return this.prisma.contract.findMany({
      where: {
        status: ContractStatus.in_progress,
        OR: [{ clientId: profileId }, { contractorId: profileId }],
      },
    });
  }
}
