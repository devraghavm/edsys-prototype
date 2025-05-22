import { Module } from '@nestjs/common';
import { SecretsService } from '@/modules/secrets/secrets.service'; // Import the SecretsService

@Module({
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}
