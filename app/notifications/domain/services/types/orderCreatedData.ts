import { IsString, IsArray, IsNumber, IsUUID } from 'class-validator';

export class OrderCreatedData {
  @IsUUID('4')
  public readonly orderId: string;

  @IsString()
  public readonly email: string;

  @IsArray()
  public readonly products: { name: string; amount: number; price: number }[];

  @IsNumber()
  public readonly totalPrice: number;
}
