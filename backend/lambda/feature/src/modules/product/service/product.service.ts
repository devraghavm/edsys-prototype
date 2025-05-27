import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Product } from '@/entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) productRepository) {
    super(productRepository);
  }
}
