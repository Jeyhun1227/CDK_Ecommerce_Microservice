import 'reflect-metadata';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { commonMiddleware, dynamoDbDocumentClient, eventBridgeClient } from '../shared';
import { StatusCodes } from 'http-status-codes';
import { BasketRepository } from '../domain/repositories/basketRepository';
import { BasketMapper, ProductMapper } from '../domain/mappers';
import { BasketService } from '../domain/services/basketService';
import { AddProductToBasketBodyDto, AddProductToBasketParamDto, AddProductToBasketResponseData } from './dtos';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { CheckoutBasketEventPublisher } from '../domain/events';

const basketRepository = new BasketRepository(dynamoDbDocumentClient, new BasketMapper(new ProductMapper()));
const basketService = new BasketService(
  basketRepository,
  new CheckoutBasketEventPublisher(eventBridgeClient),
  new LoggerService(),
);

async function addProductToBasket(event: APIGatewayEvent): Promise<ProxyResult> {
  const { id: basketId } = RecordToInstanceTransformer.strictTransform(
    event.pathParameters || {},
    AddProductToBasketParamDto,
  );

  const addProductToBasketBodyDto = RecordToInstanceTransformer.strictTransform(
    event.body ? JSON.parse(event.body) : {},
    AddProductToBasketBodyDto,
  );

  const basket = await basketService.addProductToBasket(basketId, addProductToBasketBodyDto);

  const responseData = new AddProductToBasketResponseData(basket);

  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({
      data: responseData,
    }),
  };
}

export const handler = commonMiddleware(addProductToBasket);
