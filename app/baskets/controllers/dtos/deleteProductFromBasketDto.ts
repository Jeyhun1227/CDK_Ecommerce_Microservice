import { IsUUID } from 'class-validator';
import { BasketDto } from './basketDto';

export class DeleteProductFromBasketParamDto {
  @IsUUID('4')
  public readonly id: string;

  @IsUUID('4')
  public readonly productId: string;
}

export class DeleteProductFromBasketResponseData {
  public constructor(public readonly basket: BasketDto) {}
}
