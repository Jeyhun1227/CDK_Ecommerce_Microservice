import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Product } from './product';

export class Basket {
  @IsUUID('4')
  @IsOptional()
  public id?: string;

  @IsString()
  public email: string;

  @Type(() => Product)
  @ValidateNested({ each: true })
  @IsArray()
  public readonly products: Product[];
}
