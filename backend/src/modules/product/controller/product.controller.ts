import { Controller } from '@nestjs/common';
import { ProductService } from '@/modules/product/service/product.service';
import { Crud, CrudController } from '@dataui/crud';
import { Product } from '@/entity';

@Crud({ model: { type: Product } })
@Controller('products')
export class ProductController implements CrudController<Product> {
  constructor(public readonly service: ProductService) {
    // Constructor logic can be added here if needed
  }
}
