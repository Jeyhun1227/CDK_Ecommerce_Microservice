import { OrderDto } from './orderDto';

export class GetOrdersResponseData {
  public constructor(public readonly orders: OrderDto[]) {}
}
