import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BalancesService {
  constructor(private readonly prisma: PrismaService) {}

  async depositToClient(userId: number, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      // Get total unpaid jobs for the client
      const unpaidJobs = await tx.job.findMany({
        where: {
          contract: { clientId: userId },
          isPaid: false,
        },
        select: { price: true },
      });

      const outstandingPayments = unpaidJobs.reduce(
        (acc, job) => acc + job.price.toNumber(),
        0,
      );

      if (amount > outstandingPayments * 0.25) {
        throw new BadRequestException(
          'Deposit exceeds 25% of total outstanding payments',
        );
      }

      return tx.profile.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });
    });
  }
}
