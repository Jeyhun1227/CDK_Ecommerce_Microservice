import { IsNumber, IsString, IsUUID } from 'class-validator';
import { RecordToInstanceTransformer } from '../../../common';

export class ProductDto {
  @IsUUID('4')
  public readonly id: string;

  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

  public static readonly create = RecordToInstanceTransformer.transformFactory(ProductDto);
}
