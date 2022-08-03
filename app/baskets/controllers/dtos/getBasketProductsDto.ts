import { IsUUID } from 'class-validator';

export class GetBasketProductsParamDto {
  @IsUUID('4')
  public readonly id: string;
}

export class GetBasketProductsResponseData {
  public constructor(
    public readonly products: {
      readonly id: string;
      readonly name: string;
      readonly price: number;
    }[],
  ) {}
}
