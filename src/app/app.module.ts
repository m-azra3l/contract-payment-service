import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from '../auth/auth.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import appConfig from '../config/app.config';
import { AuthMiddleware } from '../auth/auth.middleware';
import { ContractsModule } from '../contracts/contracts.module';
import { JobsModule } from '../jobs/jobs.module';
import { BalancesModule } from '../balances/balances.module';
import { AdminModule } from '../admin/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    PrismaModule,
    ContractsModule,
    JobsModule,
    BalancesModule,
    AdminModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/admin(.*)', method: RequestMethod.ALL },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
