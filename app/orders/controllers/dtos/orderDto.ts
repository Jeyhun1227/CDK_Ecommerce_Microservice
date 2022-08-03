import { Type } from 'class-transformer';
import { IsUUID, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { RecordToInstanceTransformer } from '../../../common';
import { ProductDto } from './productDto';

export class OrderDto {
  @IsUUID('4')
  public readonly id: string;

  @IsString()
  public readonly email: string;

  @IsString()
  public readonly orderDate: string;

  @IsNumber()
  public readonly totalPrice: number;

  @Type(() => ProductDto)
  @ValidateNested({ each: true })
  @IsArray()
  public readonly products: ProductDto[];

  public static readonly create = RecordToInstanceTransformer.transformFactory(OrderDto);
}
