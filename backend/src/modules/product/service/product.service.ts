import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma, Product } from '../../../generated/prisma';
import { createCustomError } from 'src/common/utils/helpers';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductDto } from '../dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {
    // Constructor logic if needed
  }

  private logger = new Logger(ProductService.name);

  // Example method to get all products
  async getAllProducts() {
    // Logic to fetch all products from the database
    this.logger.log('getAllProducts');
    try {
      const products = await this.prismaService.product.findMany();
      return plainToInstance(ProductDto, products);
    } catch (error) {
      throw createCustomError(
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Example method to get a product by ID
  async getProductById(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product | null> {
    // Logic to fetch a product by ID from the database
    this.logger.log('getProductById');
    try {
      const product = await this.prismaService.product.findUnique({
        where: productWhereUniqueInput,
      });
      if (!product) {
        throw createCustomError('Product not found', HttpStatus.NOT_FOUND);
      }
      return plainToInstance(ProductDto, product);
    } catch (error) {
      throw createCustomError(
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Example method to create a new product
  async createProduct(
    productData: Prisma.ProductCreateInput,
  ): Promise<Product> {
    // Logic to create a new product in the database
    this.logger.log('createProduct');
    try {
      const createProduct = await this.prismaService.product.create({
        data: productData,
      });
      return plainToInstance(ProductDto, createProduct);
    } catch (error) {
      throw createCustomError(
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Example method to update a product
  async updateProduct(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.ProductUpdateInput;
  }): Promise<Product> {
    // Logic to update a product in the database
    this.logger.log('updateProduct');
    try {
      const { where, data } = params;
      const updateProduct = await this.prismaService.product.update({
        data,
        where,
      });
      return updateProduct;
    } catch (error) {
      throw createCustomError(
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Example method to delete a product
  async deleteProduct(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    // Logic to delete a product from the database
    this.logger.log('deleteProduct');
    try {
      const deleteProduct = await this.prismaService.product.delete({
        where,
      });
      return deleteProduct;
    } catch (error) {
      throw createCustomError(
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
