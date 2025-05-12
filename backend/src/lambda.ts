import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { FastifyServerOptions, FastifyInstance, fastify } from 'fastify';
import * as awsLambdaFastify from '@fastify/aws-lambda';
import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { Logger } from '@nestjs/common';
import { LambdaResponse, PromiseHandler } from '@fastify/aws-lambda';

interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}

let cachedNestApp: NestApp;
let cachedProxy: PromiseHandler<unknown, LambdaResponse>;

async function bootstrapServer(): Promise<NestApp> {
  const serverOptions: FastifyServerOptions = {
    logger: true,
  };
  const instance: FastifyInstance = fastify(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
    {
      logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console,
    },
  );
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  await app.init();

  return {
    app,
    instance,
  };
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  if (!cachedNestApp) {
    cachedNestApp = await bootstrapServer();
  }
  if (!cachedProxy) {
    cachedProxy = awsLambdaFastify(cachedNestApp.instance, {
      decorateRequest: true,
    });
    await cachedNestApp.instance.ready();
  }
  return cachedProxy(event, context);
};
