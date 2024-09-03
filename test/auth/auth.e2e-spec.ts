import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Auth Middleware (e2e)', () => {
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

  it('should return 401 if profile-id header is missing', () => {
    return request(app.getHttpServer()).get('/auth/profile').expect(401);
  });

  it('should return 401 if profile is not found', async () => {
    jest.spyOn(prisma.profile, 'findUnique').mockResolvedValue(null);

    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('profile-id', '1')
      .expect(401);
  });

  it('should return 200 and profile data if profile is found', async () => {
    const mockProfile = { id: 1, firstName: 'John', lastName: 'Doe' };
    jest
      .spyOn(prisma.profile, 'findUnique')
      .mockResolvedValue(mockProfile as any);

    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('profile-id', '1')
      .expect(200)
      .expect(mockProfile);
  });
});
