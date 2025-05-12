import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
