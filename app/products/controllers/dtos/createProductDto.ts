import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductDto } from './productDto';

export class CreateProductBodyDto {
  @IsString()
  public readonly name: string;

  @IsString()
  public readonly category: string;

  @IsNumber()
  public readonly price: number;

  @IsOptional()
  @IsString()
  public readonly description?: string | null;
}

export class CreateProductResponseData {
  public constructor(public readonly product: ProductDto) {}
}
