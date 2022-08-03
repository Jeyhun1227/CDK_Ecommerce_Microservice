import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import { Duration } from 'aws-cdk-lib';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export interface OrdersQueueProperties {
  readonly consumer: IFunction;
}

export class OrdersQueue extends Construct {
  public readonly instance: IQueue;

  constructor(scope: Construct, properties: OrdersQueueProperties) {
    super(scope, 'OrdersQueue');

    this.instance = new Queue(this, 'OrdersQueue', {
      queueName: 'OrdersQueue',
      visibilityTimeout: Duration.seconds(30),
    });

    properties.consumer.addEventSource(
      new SqsEventSource(this.instance, {
        batchSize: 1,
      }),
    );
  }
}
