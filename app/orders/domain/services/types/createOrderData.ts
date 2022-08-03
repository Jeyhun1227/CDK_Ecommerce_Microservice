import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { ProductData } from './productData';

export class CreateOrderData {
  @IsString()
  public readonly email: string;

  @Type(() => ProductData)
  @ValidateNested({ each: true })
  @IsArray()
  public readonly products: ProductData[];
}
