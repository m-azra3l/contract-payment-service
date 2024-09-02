import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create two profiles: one client and one contractor
  const client = await prisma.profile.upsert({
    where: { uuid: 'client-uuid' },
    update: {},
    create: {
      uuid: 'client-uuid',
      firstName: 'Alice',
      lastName: 'Client',
      profession: 'Business Owner',
      balance: 1000,
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const contractor = await prisma.profile.upsert({
    where: { uuid: 'contractor-uuid' },
    update: {},
    create: {
      uuid: 'contractor-uuid',
      firstName: 'Bob',
      lastName: 'Contractor',
      profession: 'Developer',
      balance: 0,
      role: 'contractor',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create a contract between the client and the contractor
  const contract = await prisma.contract.upsert({
    where: { uuid: 'contract-uuid' },
    update: {},
    create: {
      uuid: 'contract-uuid',
      terms: 'Develop a new website',
      status: 'in_progress',
      clientId: client.id,
      contractorId: contractor.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create a job under the contract
  const job1 = await prisma.job.upsert({
    where: { uuid: 'job-uuid-1' },
    update: {},
    create: {
      uuid: 'job-uuid-1',
      description: 'Frontend development',
      price: 500,
      isPaid: false,
      contractId: contract.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const job2 = await prisma.job.upsert({
    where: { uuid: 'job-uuid-2' },
    update: {},
    create: {
      uuid: 'job-uuid-2',
      description: 'Backend development',
      price: 500,
      isPaid: false,
      contractId: contract.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log({ client, contractor, contract, job1, job2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
