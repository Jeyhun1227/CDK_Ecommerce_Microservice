import { DetailType } from './detailType';
import { EventBusName } from './eventBusName';
import { Source } from './source';

export interface CreateOrderEventDetail {
  readonly orderId: string;
  readonly email: string;
  readonly products: { name: string; amount: number; price: number }[];
  readonly totalPrice: number;
}

export interface CreateOrderEvent {
  source: Source.CreateOrder;
  detail: CreateOrderEventDetail;
  detailType: DetailType.CreateOrder;
  eventBusName: EventBusName.ECommerceEventBus;
}
