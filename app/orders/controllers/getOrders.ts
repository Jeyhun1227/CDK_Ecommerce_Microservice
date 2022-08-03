import 'reflect-metadata';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { ProductMapper, OrderMapper } from '../domain/mappers';
import { LoggerService } from '../../common';
import { httpMiddleware, dynamoDbDocumentClient, eventBridgeClient } from '../shared';
import { OrderRepository } from '../domain/repositories/orderRepository';
import { OrderService } from '../domain/services/orderService';
import { StatusCodes } from 'http-status-codes';
import { GetOrdersResponseData } from './dtos';
import { CreateOrderEventPublisher } from '../domain/events';

const orderRepository = new OrderRepository(dynamoDbDocumentClient, new OrderMapper(new ProductMapper()));
const orderService = new OrderService(
  orderRepository,
  new CreateOrderEventPublisher(eventBridgeClient),
  new LoggerService(),
);

async function getOrders(event: APIGatewayEvent): Promise<ProxyResult> {
  const orders = await orderService.findOrders();

  const responseData = new GetOrdersResponseData(orders);

  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({
      data: responseData,
    }),
  };
}

export const handler = httpMiddleware(getOrders);
