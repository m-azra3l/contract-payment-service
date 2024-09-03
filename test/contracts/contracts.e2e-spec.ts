import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Contracts (e2e)', () => {
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

  it('should get contract by ID', async () => {
    const contractId = 1;
    const userId = 1;
    const mockContract = { id: contractId, clientId: userId, contractorId: 2 };

    jest
      .spyOn(prisma.contract, 'findFirst')
      .mockResolvedValue(mockContract as any);

    const response = await request(app.getHttpServer())
      .get(`/contracts/${contractId}`)
      .set('profile-id', `${userId}`)
      .expect(200);

    expect(response.body).toEqual(mockContract);
  });

  it('should get active contracts successfully', async () => {
    const userId = 1;
    const mockContracts = [
      { id: 1, clientId: userId, contractorId: 5, status: 'in_progress' },
      { id: 2, clientId: userId, contractorId: 6, status: 'in_progress' },
    ];

    jest
      .spyOn(prisma.contract, 'findMany')
      .mockResolvedValue(mockContracts as any);

    const response = await request(app.getHttpServer())
      .get('/contracts')
      .set('profile-id', `${userId}`)
      .expect(200);

    expect(response.body).toEqual(mockContracts);
  });
});
