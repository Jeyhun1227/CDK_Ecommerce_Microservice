import { IsArray, IsString } from 'class-validator';
import { CheckoutBasketEventDetail } from '../../../common';

export class CreateOrderDto implements CheckoutBasketEventDetail {
  @IsString()
  public readonly email: string;

  @IsArray()
  public readonly products: { name: string; amount: number; price: number }[];
}
