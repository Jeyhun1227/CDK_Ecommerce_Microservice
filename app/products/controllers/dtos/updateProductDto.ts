import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ProductDto } from './productDto';

export class UpdateProductParamDto {
  @IsUUID('4')
  public readonly id: string;
}

export class UpdateProductBodyDto {
  @IsString()
  @IsOptional()
  public readonly description?: string;

  @IsNumber()
  @IsOptional()
  public readonly price?: number;
}

export class UpdateProductResponseData {
  public constructor(public readonly product: ProductDto) {}
}
