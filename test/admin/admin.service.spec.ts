import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../../src/admin/admin.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, PrismaService],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBestProfession', () => {
    it('should return null if no profession is found within the date range', async () => {
      jest.spyOn(prisma.job, 'groupBy').mockResolvedValue([]);

      const result = await service.getBestProfession(new Date(), new Date());
      expect(result).toBeNull();
    });

    it('should return the best profession', async () => {
      const mockGroupByResult = [{ contractorId: 1, _sum: { price: 1000 } }];
      const mockContractor = { profession: 'Developer' };
      jest
        .spyOn(prisma.job, 'groupBy')
        .mockResolvedValue(mockGroupByResult as any);
      jest
        .spyOn(prisma.profile, 'findUnique')
        .mockResolvedValue(mockContractor as any);

      const result = await service.getBestProfession(new Date(), new Date());
      expect(result).toBe('Developer');
    });
  });

  describe('getBestClients', () => {
    it('should return the best clients within the date range', async () => {
      const mockClients = [
        { id: 1, firstName: 'Alice', jobs: [{ price: 100 }] },
        { id: 2, firstName: 'Bob', jobs: [{ price: 200 }] },
      ];
      jest
        .spyOn(prisma.profile, 'findMany')
        .mockResolvedValue(mockClients as any);

      const result = await service.getBestClients(new Date(), new Date(), 2);
      expect(result).toEqual(mockClients);
    });
  });
});
