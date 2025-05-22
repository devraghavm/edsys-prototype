import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors({
    origin: '*', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow sending cookies
  });
  const secretService = app.get('SecretsService');
  const databaseUrl = await secretService.getDatabaseUrl();
  if (databaseUrl) {
    process.env.DATABASE_URL = databaseUrl;
  } else {
    throw new Error(
      'Failed to retrieve and set DATABASE_URL from Secrets Manager',
    );
  }
  await app.listen(process.env.PORT ?? 5001, '0.0.0.0');
}
bootstrap();
