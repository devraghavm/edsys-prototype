import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console,
    },
  );
  app.enableCors({
    origin: '*', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow sending cookies
  });
  const config = new DocumentBuilder()
    .setTitle('Feature API')
    .setDescription('The Feature API description')
    .setVersion('1.0')
    .addTag('feature')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(process.env.PORT ?? 5001, '0.0.0.0');
}
bootstrap();
