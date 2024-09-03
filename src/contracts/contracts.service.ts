import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractStatus } from '@prisma/client';
import { GetContractDto } from './dto/get-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async getContractById(id: number, profileId: number) {
    const contract = await this.prisma.contract.findFirst({
      where: {
        id,
        OR: [{ clientId: profileId }, { contractorId: profileId }],
      },
      include: {
        client: true,
        contractor: true,
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return {
      id: contract.id,
      uuid: contract.uuid,
      terms: contract.terms,
      status: contract.status,
      clientName: `${contract.client.firstName} ${contract.client.lastName}`,
      contractorName: `${contract.contractor.firstName} ${contract.contractor.lastName}`,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    };
  }

  async getActiveContracts(profileId: number): Promise<GetContractDto[]> {
    const contracts = await this.prisma.contract.findMany({
      where: {
        status: ContractStatus.in_progress,
        OR: [{ clientId: profileId }, { contractorId: profileId }],
      },
      include: {
        client: true,
        contractor: true,
      },
    });

    return contracts.map((contract) => ({
      id: contract.id,
      uuid: contract.uuid,
      terms: contract.terms,
      status: contract.status,
      clientName: `${contract.client.firstName} ${contract.client.lastName}`,
      contractorName: `${contract.contractor.firstName} ${contract.contractor.lastName}`,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    }));
  }
}
