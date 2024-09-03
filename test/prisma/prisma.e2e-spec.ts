import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('PrismaService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUuid: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    testUuid = uuidv4(); // Generate a unique UUID for the test

    await app.init();
  });

  afterAll(async () => {
    await prisma.profile.deleteMany({ where: { uuid: testUuid } }); // Clean up after tests
    await prisma.$disconnect();
    await app.close();
  });

  it('should connect to the database', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it('should create and retrieve a record', async () => {
    const createdProfile = await prisma.profile.create({
      data: {
        uuid: testUuid,
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
    expect(createdProfile.uuid).toBe(testUuid);

    const retrievedProfile = await prisma.profile.findUnique({
      where: { uuid: testUuid },
    });

    expect(retrievedProfile).toBeDefined();
    expect(retrievedProfile?.firstName).toBe('John');
  });

  it('should update and delete a record', async () => {
    const updatedProfile = await prisma.profile.update({
      where: { uuid: testUuid },
      data: { balance: 2000 },
    });

    expect(Number(updatedProfile.balance)).toBe(2000);

    const deletedProfile = await prisma.profile.delete({
      where: { uuid: testUuid },
    });

    expect(deletedProfile).toBeDefined();

    const nonExistentProfile = await prisma.profile.findUnique({
      where: { uuid: testUuid },
    });

    expect(nonExistentProfile).toBeNull();
  });
});
