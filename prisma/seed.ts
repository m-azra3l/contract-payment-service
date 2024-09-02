import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create 4 clients
  const clients = await Promise.all([
    prisma.profile.upsert({
      where: { uuid: uuidv4() },
      update: {},
      create: {
        uuid: uuidv4(),
        firstName: 'Alice',
        lastName: 'Client',
        profession: 'Business Owner',
        balance: 1000,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.profile.upsert({
      where: { uuid: uuidv4() },
      update: {},
      create: {
        uuid: uuidv4(),
        firstName: 'Eve',
        lastName: 'Client',
        profession: 'Entrepreneur',
        balance: 1200,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.profile.upsert({
      where: { uuid: uuidv4() },
      update: {},
      create: {
        uuid: uuidv4(),
        firstName: 'Mallory',
        lastName: 'Client',
        profession: 'Consultant',
        balance: 1500,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.profile.upsert({
      where: { uuid: uuidv4() },
      update: {},
      create: {
        uuid: uuidv4(),
        firstName: 'Trent',
        lastName: 'Client',
        profession: 'Startup Founder',
        balance: 2000,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Create 4 contractors
  const contractors = await Promise.all([
    prisma.profile.upsert({
      where: { uuid: uuidv4() },
      update: {},
      create: {
        uuid: uuidv4(),
        firstName: 'Bob',
        lastName: 'Contractor',
        profession: 'Developer',
        balance: 0,
        role: 'contractor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.profile.upsert({
      where: { uuid: uuidv4() },
      update: {},
      create: {
        uuid: uuidv4(),
        firstName: 'Charlie',
        lastName: 'Contractor',
        profession: 'Designer',
        balance: 0,
        role: 'contractor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.profile.upsert({
      where: { uuid: uuidv4() },
      update: {},
      create: {
        uuid: uuidv4(),
        firstName: 'Dave',
        lastName: 'Contractor',
        profession: 'Project Manager',
        balance: 0,
        role: 'contractor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.profile.upsert({
      where: { uuid: uuidv4() },
      update: {},
      create: {
        uuid: uuidv4(),
        firstName: 'Oscar',
        lastName: 'Contractor',
        profession: 'QA Engineer',
        balance: 0,
        role: 'contractor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Create contracts and jobs
  const contracts = await Promise.all(
    clients.map((client, index) =>
      prisma.contract.upsert({
        where: { uuid: uuidv4() },
        update: {},
        create: {
          uuid: uuidv4(),
          terms: `Contract for ${client.firstName}`,
          status: 'in_progress',
          clientId: client.id,
          contractorId: contractors[index % contractors.length].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ),
  );

  // Create jobs under each contract
  await Promise.all(
    contracts.map((contract) =>
      prisma.job.upsert({
        where: { uuid: uuidv4() },
        update: {},
        create: {
          uuid: uuidv4(),
          description: `Job for ${contract.terms}`,
          price: 500,
          isPaid: false,
          contractId: contract.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ),
  );

  console.log({ clients, contractors, contracts });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
