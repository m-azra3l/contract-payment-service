import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from '../../src/jobs/jobs.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('JobsService', () => {
  let service: JobsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService, PrismaService],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('payForJob', () => {
    it('should throw NotFoundException if job not found', async () => {
      jest.spyOn(prisma.job, 'findUnique').mockResolvedValue(null);

      await expect(service.payForJob(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if job is already paid', async () => {
      const mockJob = { isPaid: true, contract: { clientId: 1 } } as any;
      jest.spyOn(prisma.job, 'findUnique').mockResolvedValue(mockJob);

      await expect(service.payForJob(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if client balance is insufficient', async () => {
      const mockJob = {
        isPaid: false,
        price: 100,
        contract: { clientId: 1, contractorId: 5 },
      } as any;
      const mockProfile = { balance: 50 } as any;
      jest.spyOn(prisma.job, 'findUnique').mockResolvedValue(mockJob);
      jest.spyOn(prisma.profile, 'findUnique').mockResolvedValue(mockProfile);

      await expect(service.payForJob(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should complete payment successfully', async () => {
      const mockJob = {
        id: 1,
        isPaid: false,
        price: 100,
        contract: { clientId: 1, contractorId: 5 },
      } as any;
      const mockProfileClient = { id: 1, balance: 150 } as any;
      const mockProfileContractor = { id: 2, balance: 50 } as any;

      jest.spyOn(prisma.job, 'findUnique').mockResolvedValue(mockJob);
      jest
        .spyOn(prisma.profile, 'findUnique')
        .mockResolvedValueOnce(mockProfileClient);
      jest
        .spyOn(prisma.profile, 'update')
        .mockResolvedValueOnce(mockProfileClient);
      jest
        .spyOn(prisma.profile, 'update')
        .mockResolvedValueOnce(mockProfileContractor);
      jest.spyOn(prisma.job, 'update').mockResolvedValue(mockJob);

      const result = await service.payForJob(1, 1);
      expect(result).toEqual(mockJob);
    });
  });
});
