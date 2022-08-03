import { IsArray, IsString, IsNumber, IsUUID } from 'class-validator';
import { CreateOrderEventDetail } from '../../../common';

export class OrderCreatedDto implements CreateOrderEventDetail {
  @IsUUID('4')
  public readonly orderId: string;

  @IsString()
  public readonly email: string;

  @IsArray()
  public readonly products: { name: string; amount: number; price: number }[];

  @IsNumber()
  public readonly totalPrice: number;
}
