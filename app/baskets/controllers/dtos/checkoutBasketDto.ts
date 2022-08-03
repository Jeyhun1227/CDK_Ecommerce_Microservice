import { IsUUID } from 'class-validator';

export class CheckoutBasketBodyDto {
  @IsUUID('4')
  public readonly basketId: string;
}
