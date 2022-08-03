import { IsNumber, IsString } from 'class-validator';
import { RecordToInstanceTransformer } from '../../../common';

export class ProductDto {
  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

  @IsNumber()
  public readonly amount: number;

  public static readonly create = RecordToInstanceTransformer.transformFactory(ProductDto);
}
