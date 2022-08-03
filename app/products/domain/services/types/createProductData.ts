import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProductData {
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
