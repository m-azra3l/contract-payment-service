import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BestClientDto } from './dto/best-client.dto';

interface BestProfessionResult {
  contractorId: number;
  total: number;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Use raw query due to cyclic error
  async getBestProfession(start: Date, end: Date): Promise<object> {
    const result = await this.prisma.$queryRaw<BestProfessionResult[]>`
      SELECT c."contractorId", SUM(j."price") as total
      FROM "Job" j
      JOIN "Contract" c ON j."contractId" = c."id"
      WHERE j."paidDate" BETWEEN ${start} AND ${end}
      GROUP BY c."contractorId"
      ORDER BY total DESC
      LIMIT 1
    `;

    if (result.length === 0) return null;

    const bestContractor = await this.prisma.profile.findUnique({
      where: { id: result[0]?.contractorId },
    });

    return {
      profession: bestContractor?.profession || null,
    };
  }

  async getBestClients(
    start: Date,
    end: Date,
    limit: number
  ): Promise<BestClientDto[]> {
    const clientsWithJobSums = await this.prisma.profile.findMany({
      where: {
        role: 'client',
        jobs: {
          some: {
            paidDate: {
              gte: start,
              lte: end,
            },
          },
        },
      },
      include: {
        jobs: {
          where: {
            paidDate: {
              gte: start,
              lte: end,
            },
          },
          select: {
            price: true,
          },
        },
      },
    });

    const clientsWithTotalPayments = clientsWithJobSums.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      role: client.role,
      totalPaid: client.jobs.reduce(
        (sum, job) => sum + job.price.toNumber(),
        0
      ),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));

    const sortedClients = clientsWithTotalPayments.sort(
      (a, b) => b.totalPaid - a.totalPaid
    );

    return sortedClients.slice(0, limit);
  }
}
