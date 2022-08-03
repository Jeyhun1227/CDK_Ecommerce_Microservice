import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { RecordToInstanceTransformer } from '../../../common';
import { ProductDto } from './productDto';

export class BasketDto {
  @IsUUID('4')
  public readonly id: string;

  @IsString()
  public readonly email: string;

  @Type(() => ProductDto)
  @ValidateNested({ each: true })
  @IsArray()
  public readonly products: ProductDto[];

  public static readonly create = RecordToInstanceTransformer.transformFactory(BasketDto);
}
