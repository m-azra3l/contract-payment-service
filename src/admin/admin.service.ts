import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getBestProfession(start: Date, end: Date) {
    const result = (await this.prisma.job.groupBy({
      by: ['contractorId'],
      where: {
        paidDate: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        price: true,
      },
      orderBy: {
        _sum: {
          price: 'desc',
        },
      },
      take: 1,
    })) as any;

    if (result.length === 0) return null;

    const bestContractor = await this.prisma.profile.findUnique({
      where: { id: result[0].contractorId },
    });

    return bestContractor?.profession || null;
  }

  async getBestClients(start: Date, end: Date, limit: number) {
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
      ...client,
      totalPaid: client.jobs.reduce(
        (sum, job) => sum + job.price.toNumber(),
        0,
      ),
    }));

    const sortedClients = clientsWithTotalPayments.sort(
      (a, b) => b.totalPaid - a.totalPaid,
    );

    return sortedClients.slice(0, limit);
  }
}
