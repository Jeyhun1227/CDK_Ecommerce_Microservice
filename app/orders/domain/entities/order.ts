import { Type } from 'class-transformer';
import { IsUUID, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Product } from './product';

export class Order {
  @IsUUID('4')
  public id?: string;

  @IsString()
  public email: string;

  @IsString()
  public orderDate?: string;

  @IsNumber()
  public totalPrice?: number;

  @Type(() => Product)
  @ValidateNested({ each: true })
  @IsArray()
  public products: Product[];
}
