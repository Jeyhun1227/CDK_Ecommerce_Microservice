import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { RecordToInstanceTransformer } from '../../../common';

export class ProductDto {
  @IsUUID('4')
  public readonly id: string;

  @IsString()
  public readonly name: string;

  @IsString()
  public readonly category: string;

  @IsNumber()
  public readonly price: number;

  @IsOptional()
  @IsString()
  public readonly description?: string | null;

  public static readonly create = RecordToInstanceTransformer.transformFactory(ProductDto);
}
