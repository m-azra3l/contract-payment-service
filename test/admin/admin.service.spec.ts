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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBestProfession', () => {
    it('should return the best profession when results are found', async () => {
      const mockResult = [{ contractorId: 1, total: 1000 }];

      const mockProfile = { profession: 'Developer' };

      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(mockResult);
      jest
        .spyOn(prisma.profile, 'findUnique')
        .mockResolvedValue(mockProfile as any);

      const result = await service.getBestProfession(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result).toEqual({ profession: 'Developer' });
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(prisma.profile.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when no results are found', async () => {
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([]);
      const result = await service.getBestProfession(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result).toBeNull();
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(prisma.profile.findUnique).not.toHaveBeenCalled();
    });

    it('should return null when the contractor is not found', async () => {
      const mockResult = [{ contractorId: 1, total: 1000 }];

      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(mockResult);
      jest.spyOn(prisma.profile, 'findUnique').mockResolvedValue(null);

      const result = await service.getBestProfession(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result).toEqual({ profession: null });
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(prisma.profile.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
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
