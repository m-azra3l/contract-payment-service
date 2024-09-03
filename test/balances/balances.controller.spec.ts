import { Test, TestingModule } from '@nestjs/testing';
import { BalancesController } from '../../src/balances/balances.controller';
import { BalancesService } from '../../src/balances/balances.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('BalancesController', () => {
  let controller: BalancesController;
  let service: BalancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalancesController],
      providers: [BalancesService, PrismaService],
    }).compile();

    controller = module.get<BalancesController>(BalancesController);
    service = module.get<BalancesService>(BalancesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit', () => {
    it('should throw ForbiddenException if user tries to deposit into another account', async () => {
      const req = { headers: { 'profile-id': '1' } } as any;

      await expect(
        controller.deposit('2', { amount: 50 }, req),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should successfully deposit money into user account', async () => {
      const req = { headers: { 'profile-id': '1' } } as any;
      jest
        .spyOn(service, 'depositToClient')
        .mockResolvedValue({ balance: 150 } as any);

      await expect(
        controller.deposit('1', { amount: 50 }, req),
      ).resolves.not.toThrow();
    });
  });
});
