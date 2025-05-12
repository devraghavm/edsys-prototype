import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Product as ProductModel } from '../../../generated/prisma';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {
    // Constructor logic can be added here if needed
  }

  @Get()
  async getAllProducts() {
    // Logic to fetch all products from the database
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    // Logic to fetch a product by ID from the database
    return this.productService.getProductById({ id });
  }

  @Post()
  async createProduct(
    @Body() productData: CreateProductDto,
  ): Promise<ProductModel> {
    // Logic to create a new product in the database
    return this.productService.createProduct(productData);
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: UpdateProductDto,
  ): Promise<ProductModel> {
    // Logic to update a product in the database
    return this.productService.updateProduct({
      where: { id },
      data: productData,
    });
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductModel> {
    // Logic to delete a product from the database
    return this.productService.deleteProduct({ id });
  }
}
