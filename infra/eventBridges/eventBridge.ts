import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export interface EventBridgeProperties {
  readonly publishers: IFunction[];
  readonly checkoutBasketRuleTarget: IQueue;
  readonly createOrderRuleTarget: IQueue;
}

export class EventBridge extends Construct {
  constructor(scope: Construct, properties: EventBridgeProperties) {
    super(scope, 'ECommerceEventBridge');

    const eventBus = new EventBus(this, 'ECommerceEventBus', { eventBusName: 'ECommerceEventBus' });

    const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
      eventBus,
      enabled: true,
      description: 'Basket microservice checkouts the basket',
      eventPattern: {
        source: ['com.ecommerce.basket.checkoutbasket'],
        detailType: ['CheckoutBasket'],
      },
      ruleName: 'CheckoutBasketRule',
    });

    checkoutBasketRule.addTarget(new SqsQueue(properties.checkoutBasketRuleTarget));

    const createOrderRule = new Rule(this, 'CreateOrderRule', {
      eventBus,
      enabled: true,
      description: 'Orders microservice creates the order',
      eventPattern: {
        source: ['com.ecommerce.order.create'],
        detailType: ['CreateOrder'],
      },
      ruleName: 'CreateOrderRule',
    });

    createOrderRule.addTarget(new SqsQueue(properties.createOrderRuleTarget));

    for (const publisher of properties.publishers) {
      eventBus.grantPutEventsTo(publisher);
    }
  }
}
