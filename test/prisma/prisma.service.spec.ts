import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      jest.spyOn(service, '$connect').mockResolvedValue();
      await expect(service.onModuleInit()).resolves.not.toThrow();
      expect(service.$connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from the database', async () => {
      jest.spyOn(service, '$disconnect').mockResolvedValue();
      await expect(service.onModuleDestroy()).resolves.not.toThrow();
      expect(service.$disconnect).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle known request errors', async () => {
      const error = new PrismaClientKnownRequestError('Error message', {
        code: 'P2002',
        clientVersion: '4.0.0',
        meta: {},
      });
      jest.spyOn(service, '$connect').mockRejectedValue(error);

      try {
        await service.onModuleInit();
      } catch (err) {
        expect(err).toBeInstanceOf(PrismaClientKnownRequestError);
        expect(err.code).toBe('P2002');
      }
    });
  });
});
