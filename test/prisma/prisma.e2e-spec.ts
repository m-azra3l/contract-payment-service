import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('PrismaService (e2e)', () => {
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
    await prisma.$disconnect();
    await app.close();
  });

  it('should connect to the database', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it('should create and retrieve a record', async () => {
    const createdProfile = await prisma.profile.create({
      data: {
        uuid: '1234-5678',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Developer',
        balance: 1000,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    expect(createdProfile).toBeDefined();
    expect(createdProfile.uuid).toBe('1234-5678');

    const retrievedProfile = await prisma.profile.findUnique({
      where: { uuid: '1234-5678' },
    });

    expect(retrievedProfile).toBeDefined();
    expect(retrievedProfile?.firstName).toBe('John');
  });

  it('should update and delete a record', async () => {
    const updatedProfile = await prisma.profile.update({
      where: { uuid: '1234-5678' },
      data: { balance: 2000 },
    });

    expect(updatedProfile.balance).toBe(2000);

    const deletedProfile = await prisma.profile.delete({
      where: { uuid: '1234-5678' },
    });

    expect(deletedProfile).toBeDefined();

    const nonExistentProfile = await prisma.profile.findUnique({
      where: { uuid: '1234-5678' },
    });

    expect(nonExistentProfile).toBeNull();
  });
});
