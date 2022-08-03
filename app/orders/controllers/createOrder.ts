import 'reflect-metadata';
import { SQSEvent } from 'aws-lambda';
import { ProductMapper, OrderMapper } from '../domain/mappers';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { dynamoDbDocumentClient, eventBridgeClient, eventMiddleware } from '../shared';
import { OrderRepository } from '../domain/repositories/orderRepository';
import { OrderService } from '../domain/services/orderService';
import { CreateOrderDto } from './dtos';
import { CreateOrderEventPublisher } from '../domain/events';

const orderRepository = new OrderRepository(dynamoDbDocumentClient, new OrderMapper(new ProductMapper()));
const orderService = new OrderService(
  orderRepository,
  new CreateOrderEventPublisher(eventBridgeClient),
  new LoggerService(),
);

async function createOrder(event: SQSEvent): Promise<void> {
  const eventActions = event.Records.map(async (record) => {
    const recordDetail = JSON.parse(record.body).detail;

    const createOrderDto = RecordToInstanceTransformer.strictTransform(recordDetail, CreateOrderDto);

    await orderService.createOrder(createOrderDto);
  });

  await Promise.all(eventActions);
}

export const handler = eventMiddleware(createOrder);
