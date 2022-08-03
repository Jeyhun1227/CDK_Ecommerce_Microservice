import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { CreateOrderEvent, DetailType, EventBusName, EventBusPublisher, Source } from '../../../common';

export class CreateOrderEventPublisher extends EventBusPublisher<CreateOrderEvent> {
  readonly source = Source.CreateOrder;
  readonly detailType = DetailType.CreateOrder;
  readonly eventBusName = EventBusName.ECommerceEventBus;

  constructor(eventBridgeClient: EventBridgeClient) {
    super(eventBridgeClient);
  }
}
