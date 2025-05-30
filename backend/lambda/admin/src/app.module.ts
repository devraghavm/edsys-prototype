import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@/modules/user/user.module';
import { SecretsService } from '@/modules/secrets/secrets.service';
import { SecretsModule } from '@/modules/secrets/secrets.module';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@/config/database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SecretsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService, SecretsService],
      useClass: TypeOrmConfigService,
      imports: [ConfigModule, SecretsModule],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [SecretsService, AppService],
})
export class AppModule {}
