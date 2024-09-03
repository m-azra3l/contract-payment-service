import { Test, TestingModule } from '@nestjs/testing';
import { AuthMiddleware } from '../../src/auth/auth.middleware';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        {
          provide: PrismaService,
          useValue: {
            profile: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    middleware = module.get<AuthMiddleware>(AuthMiddleware);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = { headers: {} };
      res = {};
      next = jest.fn();
    });

    it('should throw UnauthorizedException if profile-id header is missing', async () => {
      await expect(
        middleware.use(req as Request, res as Response, next)
      ).rejects.toThrow(UnauthorizedException);
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if profile is not found', async () => {
      req.headers['profile-id'] = '1';
      jest.spyOn(prisma.profile, 'findUnique').mockResolvedValue(null);

      await expect(
        middleware.use(req as Request, res as Response, next)
      ).rejects.toThrow(UnauthorizedException);
      expect(next).not.toHaveBeenCalled();
    });

    it('should attach profile to the request object if profile is found', async () => {
      const mockProfile = { id: 1, firstName: 'John', lastName: 'Doe' };
      req.headers['profile-id'] = '1';
      jest
        .spyOn(prisma.profile, 'findUnique')
        .mockResolvedValue(mockProfile as any);

      await middleware.use(req as Request, res as Response, next);

      expect(req['profile']).toEqual(mockProfile);
      expect(next).toHaveBeenCalled();
    });
  });
});
