import { BasketDto } from './basketDto';

export class GetBasketsResponseData {
  public constructor(public readonly baskets: BasketDto[]) {}
}
