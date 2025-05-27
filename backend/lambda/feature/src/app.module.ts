import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ProductModule } from '@/modules/product/product.module';
import { SecretsService } from '@/modules/secrets/secrets.service';
import { SecretsModule } from '@/modules/secrets/secrets.module';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@/config/database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
      imports: [ConfigModule, SecretsModule],
    }),
    SecretsModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [SecretsService, AppService],
})
export class AppModule {}
