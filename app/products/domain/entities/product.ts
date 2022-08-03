import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class Product {
  @IsUUID('4')
  public id?: string;

  @IsString()
  public name: string;

  @IsString()
  public category: string;

  @IsNumber()
  public price: number;

  @IsOptional()
  @IsString()
  public description?: string | null;
}
