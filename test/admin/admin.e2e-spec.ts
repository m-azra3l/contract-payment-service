import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get the best profession', async () => {
    jest
      .spyOn(prisma.job, 'groupBy')
      .mockResolvedValue([{ contractorId: 1, _sum: { price: 1000 } }]);
    jest
      .spyOn(prisma.profile, 'findUnique')
      .mockResolvedValue({ profession: 'Developer' });

    const response = await request(app.getHttpServer())
      .get('/admin/best-profession?start=2024-01-01&end=2024-12-31')
      .expect(200);

    expect(response.text).toBe('Developer');
  });

  it('should get the best clients', async () => {
    const mockClients = [
      { id: 1, firstName: 'Alice', jobs: [{ price: 100 }] },
      { id: 2, firstName: 'Bob', jobs: [{ price: 200 }] },
    ];
    jest
      .spyOn(prisma.profile, 'findMany')
      .mockResolvedValue(mockClients as any);

    const response = await request(app.getHttpServer())
      .get('/admin/best-clients?start=2024-01-01&end=2024-12-31&limit=2')
      .expect(200);

    expect(response.body).toEqual(mockClients);
  });
});
