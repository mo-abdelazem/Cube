import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Frontend URLs
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Nebula API')
    .setDescription('Multi-language e-commerce platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);

  console.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  console.log(
    `📚 Swagger docs available at: http://localhost:${port}/${apiPrefix}/docs`,
  );
}
bootstrap();
