import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Jobs (e2e)', () => {
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

  it('should get unpaid jobs successfully', async () => {
    const userId = 1;
    const mockJobs = [
      { id: 1, isPaid: false },
      { id: 2, isPaid: false },
    ];

    jest.spyOn(prisma.job, 'findMany').mockResolvedValue(mockJobs as any);

    const response = await request(app.getHttpServer())
      .get('/jobs/unpaid')
      .set('profile-id', `${userId}`)
      .expect(200);

    expect(response.body).toEqual(mockJobs);
  });

  it('should pay for a job successfully', async () => {
    const jobId = 1;
    const userId = 1;

    jest.spyOn(prisma.job, 'findUnique').mockResolvedValue({
      id: jobId,
      isPaid: false,
      price: 100,
      contract: { clientId: userId, contractorId: 2 },
    } as any);

    await request(app.getHttpServer())
      .post(`/jobs/${jobId}/pay`)
      .set('profile-id', `${userId}`)
      .expect(204); // No Content
  });
});
