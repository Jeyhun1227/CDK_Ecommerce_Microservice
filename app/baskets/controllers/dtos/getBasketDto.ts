import { IsUUID } from 'class-validator';
import { BasketDto } from './basketDto';

export class GetBasketParamDto {
  @IsUUID('4')
  public readonly id: string;
}

export class GetBasketResponseData {
  public constructor(public readonly basket: BasketDto) {}
}
