import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from '../../src/contracts/contracts.controller';
import { ContractsService } from '../../src/contracts/contracts.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [ContractsService, PrismaService],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getContractById', () => {
    it('should throw NotFoundException if contract is not found', async () => {
      jest
        .spyOn(service, 'getContractById')
        .mockRejectedValue(new NotFoundException());

      const req = { headers: { 'profile-id': '1' } } as any;
      await expect(controller.getContractById('1', req)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should return contract if found', async () => {
      const mockContract = { id: 1, clientId: 1, contractorId: 2 };
      jest
        .spyOn(service, 'getContractById')
        .mockResolvedValue(mockContract as any);

      const req = { headers: { 'profile-id': '1' } } as any;
      const result = await controller.getContractById('1', req);
      expect(result).toEqual(mockContract);
    });
  });

  describe('getActiveContracts', () => {
    it('should return active contracts for the authenticated user', async () => {
      const mockContracts = [
        { id: 1, clientId: 1, contractorId: 2, status: 'in_progress' },
      ];
      jest
        .spyOn(service, 'getActiveContracts')
        .mockResolvedValue(mockContracts as any);

      const req = { headers: { 'profile-id': '1' } } as any;
      const result = await controller.getActiveContracts(req);
      expect(result).toEqual(mockContracts);
    });
  });
});
