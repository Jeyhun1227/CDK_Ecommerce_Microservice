import 'reflect-metadata';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { commonMiddleware, dynamoDbDocumentClient, eventBridgeClient } from '../shared';
import { StatusCodes } from 'http-status-codes';
import { BasketRepository } from '../domain/repositories/basketRepository';
import { BasketMapper, ProductMapper } from '../domain/mappers';
import { BasketService } from '../domain/services/basketService';
import { CreateBasketBodyDto, CreateBasketResponseData } from './dtos';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { CheckoutBasketEventPublisher } from '../domain/events';

const basketRepository = new BasketRepository(dynamoDbDocumentClient, new BasketMapper(new ProductMapper()));
const basketService = new BasketService(
  basketRepository,
  new CheckoutBasketEventPublisher(eventBridgeClient),
  new LoggerService(),
);

async function createBasket(event: APIGatewayEvent): Promise<ProxyResult> {
  const createBasketBodyDto = RecordToInstanceTransformer.strictTransform(
    event.body ? JSON.parse(event.body) : {},
    CreateBasketBodyDto,
  );

  const basket = await basketService.createBasket(createBasketBodyDto);

  const responseData = new CreateBasketResponseData(basket);

  return {
    statusCode: StatusCodes.CREATED,
    body: JSON.stringify({
      data: responseData,
    }),
  };
}

export const handler = commonMiddleware(createBasket);
