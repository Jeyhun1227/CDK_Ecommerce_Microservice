import { IsString } from 'class-validator';
import { BasketDto } from './basketDto';

export class CreateBasketBodyDto {
  @IsString()
  public readonly email: string;
}

export class CreateBasketResponseData {
  public constructor(public readonly basket: BasketDto) {}
}
