import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Accessing ConfigService to retrieve the port value
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Contract Payment Service')
    .setDescription('API documentation for the Contract Payment Service')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Development server')
    .addServer('https://to-be-specified', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
}
bootstrap();
