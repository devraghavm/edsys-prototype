import { Injectable } from '@nestjs/common';
import { Signer } from '@aws-sdk/rds-signer';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '@/entity';

@Injectable()
export class SecretsService {
  private secretsManagerClient: SecretsManagerClient;

  constructor() {
    this.secretsManagerClient = new SecretsManagerClient({
      region: process.env.region, // Get region from environment variable
    });
  }

  private async getSecret(secretId: string): Promise<any> {
    try {
      const command = new GetSecretValueCommand({ SecretId: secretId });
      const response = await this.secretsManagerClient.send(command);
      if (response.SecretString) {
        return JSON.parse(response.SecretString);
      }
      throw new Error('Secret string is empty');
    } catch (error) {
      console.error('Error fetching secret:', error);
      throw error;
    }
  }

  async getDatabaseOptions(): Promise<TypeOrmModuleOptions> {
    try {
      console.log(process.env.NODE_ENV);
      if (process.env.NODE_ENV !== 'production') {
        return {
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT || '3306', 10),
          username: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          entities: [__dirname + '/../../entity/**.entity{.ts,.js}'],
          synchronize: true,
          ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions;
      }
      const credentials = await this.getSecret(
        process.env.lambda_secret_name || 'lambda_secret_name',
      );
      const signer = new Signer({
        hostname: credentials.host,
        port: parseInt(credentials.port),
        username: credentials.username,
        region: process.env.region, // Get region from environment variable
      });
      const token = await signer.getAuthToken();
      return {
        type: 'mysql',
        host: credentials.host,
        port: parseInt(credentials.port, 10),
        username: credentials.username,
        password: token, // Use the token as the password
        database: credentials.dbname,
        entities: [Product],
        synchronize: true,
        ssl: { rejectUnauthorized: false },
      } as TypeOrmModuleOptions;
    } catch (error) {
      console.error('Error configuring Prisma:', error);
      throw error;
    }
  }
}
