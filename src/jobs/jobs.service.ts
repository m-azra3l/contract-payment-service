import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Job } from '@prisma/client';
import { GetUnpaidJobsDto } from './dto/get-unpaid-jobs.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async payForJob(jobId: number, profileId: number): Promise<Job> {
    return this.prisma.$transaction(async (tx) => {
      // Find the job and ensure it belongs to an active contract
      const job = await tx.job.findUnique({
        where: { id: jobId },
        include: { contract: true },
      });

      if (!job) {
        throw new NotFoundException('Job not found');
      }

      if (job.isPaid) {
        throw new ForbiddenException('Job is already paid');
      }

      if (job.contract.clientId !== profileId) {
        throw new ForbiddenException('You can only pay for your own jobs');
      }

      const client = await tx.profile.findUnique({
        where: { id: profileId },
      });

      if (client.balance < job.price) {
        throw new ForbiddenException('Insufficient balance');
      }

      // Decrement the client's balance
      await tx.profile.update({
        where: { id: profileId },
        data: { balance: { decrement: job.price } },
      });

      // Increment the contractor's balance
      await tx.profile.update({
        where: { id: job.contract.contractorId },
        data: { balance: { increment: job.price } },
      });

      // Mark the job as paid
      return tx.job.update({
        where: { id: jobId },
        data: {
          isPaid: true,
          paidDate: new Date(),
        },
      });
    });
  }

  async getUnpaidJobs(profileId: number): Promise<GetUnpaidJobsDto[]> {
    const jobs = await this.prisma.job.findMany({
      where: {
        isPaid: false,
        contract: {
          status: 'in_progress',
          OR: [{ clientId: profileId }, { contractorId: profileId }],
        },
      },
      include: {
        contract: {
          include: {
            client: true,
            contractor: true,
          },
        },
      },
    });

    return jobs.map((job) => ({
      id: job.id,
      uuid: job.uuid,
      description: job.description,
      price: job.price,
      isPaid: job.isPaid,
      contractId: job.contractId,
      contractStatus: job.contract?.status || 'unknown',
      clientName: `${job.contract.client.firstName} ${job.contract.client.lastName}`,
      contractorName: `${job.contract.contractor.firstName} ${job.contract.contractor.lastName}`,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));
  }
}
