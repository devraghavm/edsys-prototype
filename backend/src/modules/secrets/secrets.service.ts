import { Injectable } from '@nestjs/common';
import { Signer } from '@aws-sdk/rds-signer';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

@Injectable()
export class SecretsService {
  private secretsManagerClient: SecretsManagerClient;

  constructor() {
    this.secretsManagerClient = new SecretsManagerClient({
      region: process.env.AWS_REGION, // Get region from environment variable
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

  async getDatabaseUrl() {
    try {
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
      return `mysql://${credentials.username}:${token}@${credentials.host}:${credentials.port}/${credentials.dbname}?sslmode=require`;
    } catch (error) {
      console.error('Error configuring Prisma:', error);
      throw error;
    }
  }
}
