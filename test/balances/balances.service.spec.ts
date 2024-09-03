import { Test, TestingModule } from '@nestjs/testing';
import { BalancesService } from '../../src/balances/balances.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('BalancesService', () => {
  let service: BalancesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalancesService, PrismaService],
    }).compile();

    service = module.get<BalancesService>(BalancesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('depositToClient', () => {
    it('should throw BadRequestException if deposit exceeds 25% of total outstanding payments', async () => {
      jest
        .spyOn(prisma.job, 'findMany')
        .mockResolvedValue([{ price: 100 }, { price: 200 }] as any); // Outstanding = 300

      await expect(service.depositToClient(1, 100)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should successfully deposit money to the client account', async () => {
      jest
        .spyOn(prisma.job, 'findMany')
        .mockResolvedValue([{ price: 100 }, { price: 200 }] as any); // Outstanding = 300
      jest
        .spyOn(prisma.profile, 'update')
        .mockResolvedValue({ balance: 150 } as any);

      const result = await service.depositToClient(1, 50); // Deposit within 25%
      expect(result.balance).toBe(150);
    });
  });
});
