import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from '../../src/contracts/contracts.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ContractsService', () => {
  let service: ContractsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractsService, PrismaService],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getContractById', () => {
    it('should throw NotFoundException if contract is not found', async () => {
      jest.spyOn(prisma.contract, 'findFirst').mockResolvedValue(null);

      await expect(service.getContractById(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return contract if found and belongs to the user', async () => {
      const mockContract = {
        id: 1,
        clientId: 1,
        contractorId: 2,
        status: 'in_progress',
      };
      jest
        .spyOn(prisma.contract, 'findFirst')
        .mockResolvedValue(mockContract as any);

      const result = await service.getContractById(1, 1);
      expect(result).toEqual(mockContract);
    });
  });

  describe('getActiveContracts', () => {
    it('should return active contracts associated with the user', async () => {
      const mockContracts = [
        { id: 1, clientId: 1, contractorId: 2, status: 'in_progress' },
        { id: 2, clientId: 1, contractorId: 3, status: 'in_progress' },
      ];
      jest
        .spyOn(prisma.contract, 'findMany')
        .mockResolvedValue(mockContracts as any);

      const result = await service.getActiveContracts(1);
      expect(result).toEqual(mockContracts);
    });
  });
});
