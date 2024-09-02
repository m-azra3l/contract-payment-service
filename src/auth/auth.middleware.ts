import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const profileId = req.headers['profile-id'];

    if (!profileId) {
      throw new UnauthorizedException('Profile ID is required');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: Number(profileId) },
    });

    if (!profile) {
      throw new UnauthorizedException('Profile not found');
    }

    // Attach the profile to the request object
    req['profile'] = profile;
    next();
  }
}
