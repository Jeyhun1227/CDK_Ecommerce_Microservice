import { DetailType } from './detailType';
import { EventBusName } from './eventBusName';
import { Source } from './source';

export interface CheckoutBasketEventDetail {
  readonly email: string;
  readonly products: { name: string; amount: number; price: number }[];
}

export interface CheckoutBasketEvent {
  source: Source.CheckoutBasket;
  detail: CheckoutBasketEventDetail;
  detailType: DetailType.CheckoutBasket;
  eventBusName: EventBusName.ECommerceEventBus;
}
