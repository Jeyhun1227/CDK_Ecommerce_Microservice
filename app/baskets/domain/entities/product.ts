import { IsNumber, IsString, IsUUID } from 'class-validator';

export class Product {
  @IsUUID('4')
  public readonly id: string;

  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;
}
