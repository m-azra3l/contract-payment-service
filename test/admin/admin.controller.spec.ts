import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../../src/admin/admin.controller';
import { AdminService } from '../../src/admin/admin.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [AdminService, PrismaService],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBestProfession', () => {
    it('should return the best profession within the date range', async () => {
      jest.spyOn(service, 'getBestProfession').mockResolvedValue('Developer');

      const result = await controller.getBestProfession(
        '2024-01-01',
        '2024-12-31'
      );
      expect(result).toBe('Developer');
    });
  });

  describe('getBestClients', () => {
    it('should return the best clients within the date range', async () => {
      const mockClients = [
        { id: 1, firstName: 'Alice' },
        { id: 2, firstName: 'Bob' },
      ];
      jest
        .spyOn(service, 'getBestClients')
        .mockResolvedValue(mockClients as any);

      const result = await controller.getBestClients(
        '2024-01-01',
        '2024-12-31',
        '2'
      );
      expect(result).toEqual(mockClients);
    });
  });
});
