import { Module } from '@nestjs/common';
import { ProductController } from '@/modules/product/controller/product.controller';
import { ProductService } from '@/modules/product/service/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
