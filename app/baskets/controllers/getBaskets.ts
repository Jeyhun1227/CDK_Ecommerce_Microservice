import 'reflect-metadata';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { commonMiddleware, dynamoDbDocumentClient, eventBridgeClient } from '../shared';
import { StatusCodes } from 'http-status-codes';
import { BasketRepository } from '../domain/repositories/basketRepository';
import { BasketMapper, ProductMapper } from '../domain/mappers';
import { BasketService } from '../domain/services/basketService';
import { LoggerService } from '../../common';
import { GetBasketsResponseData } from './dtos';
import { CheckoutBasketEventPublisher } from '../domain/events';

const basketRepository = new BasketRepository(dynamoDbDocumentClient, new BasketMapper(new ProductMapper()));
const basketService = new BasketService(
  basketRepository,
  new CheckoutBasketEventPublisher(eventBridgeClient),
  new LoggerService(),
);

async function getBaskets(event: APIGatewayEvent): Promise<ProxyResult> {
  const baskets = await basketService.findBaskets();

  const responseData = new GetBasketsResponseData(baskets);

  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({
      data: responseData,
    }),
  };
}

export const handler = commonMiddleware(getBaskets);
