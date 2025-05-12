import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/common';

export class ProductDto extends AbstractDto {
  @Expose()
  title: string;
}
