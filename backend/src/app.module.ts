import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { ProductModule } from '@/modules/product/product.module';
import { SecretsService } from './modules/secrets/secrets.service';
import { SecretsModule } from './modules/secrets/secrets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SecretsModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [SecretsService, AppService],
})
export class AppModule {}
