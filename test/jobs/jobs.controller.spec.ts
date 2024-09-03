import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from '../../src/jobs/jobs.controller';
import { JobsService } from '../../src/jobs/jobs.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { Job } from '@prisma/client';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [JobsService, PrismaService],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnpaidJobs', () => {
    it('should return unpaid jobs for the authenticated user', async () => {
      const mockJobs: Job[] = [
        {
          id: 1,
          uuid: 'uuid-1',
          description: 'Mock job 1',
          price: new Decimal('100'),
          isPaid: false,
          paidDate: undefined,
          contractId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          uuid: 'uuid-2',
          description: 'Mock job 2',
          price: new Decimal('200'),
          isPaid: false,
          paidDate: undefined,
          contractId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'getUnpaidJobs').mockResolvedValue(mockJobs);

      const req = { headers: { 'profile-id': '1' } } as any;
      const result = await controller.getUnpaidJobs(req);
      expect(result).toEqual(mockJobs);
    });
  });

  describe('payForJob', () => {
    it('should successfully process a payment', async () => {
      const req = { headers: { 'profile-id': '1' } } as any;
      jest.spyOn(service, 'payForJob').mockResolvedValue(undefined);

      await expect(controller.payForJob('1', req)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if job not found', async () => {
      const req = { headers: { 'profile-id': '1' } } as any;
      jest
        .spyOn(service, 'payForJob')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.payForJob('1', req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if payment is not allowed', async () => {
      const req = { headers: { 'profile-id': '1' } } as any;
      jest
        .spyOn(service, 'payForJob')
        .mockRejectedValue(new ForbiddenException());

      await expect(controller.payForJob('1', req)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
