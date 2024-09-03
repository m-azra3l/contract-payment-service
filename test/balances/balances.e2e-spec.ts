import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Balances (e2e)', () => {
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

  it('should deposit money successfully', async () => {
    const userId = 1;
    const depositAmount = 50;

    jest
      .spyOn(prisma.job, 'findMany')
      .mockResolvedValue([{ price: 100 }, { price: 200 }] as any);

    await request(app.getHttpServer())
      .post(`/balances/deposit/${userId}`)
      .set('profile-id', `${userId}`)
      .send({ amount: depositAmount })
      .expect(204); // No Content
  });

  it("should return 403 if trying to deposit into another user's account", async () => {
    const userId = 1;
    const anotherUserId = 2;
    const depositAmount = 50;

    await request(app.getHttpServer())
      .post(`/balances/deposit/${anotherUserId}`)
      .set('profile-id', `${userId}`)
      .send({ amount: depositAmount })
      .expect(403);
  });
});
