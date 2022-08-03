import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProductData {
  @IsString()
  @IsOptional()
  public readonly description?: string;

  @IsNumber()
  @IsOptional()
  public readonly price?: number;
}
