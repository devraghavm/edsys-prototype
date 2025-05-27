import { Expose } from 'class-transformer';
import { AbstractDto } from '@/common';

export class ProductDto extends AbstractDto {
  @Expose()
  title: string;
}
