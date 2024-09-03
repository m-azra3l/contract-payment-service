import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getBestProfession(start: Date, end: Date) {
    const result = await this.prisma.job.groupBy({
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
    });

    if (result.length === 0) return null;

    const bestContractor = await this.prisma.profile.findUnique({
      where: { id: result[0].contractorId },
    });

    return bestContractor?.profession;
  }

  async getBestClients(start: Date, end: Date, limit: number) {
    return this.prisma.profile.findMany({
      where: {
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
          select: {
            price: true,
          },
        },
      },
      orderBy: {
        jobs: {
          _sum: {
            price: 'desc',
          },
        },
      },
      take: limit,
    });
  }
}
