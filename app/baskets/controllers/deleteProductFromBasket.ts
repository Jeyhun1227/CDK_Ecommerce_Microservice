import 'reflect-metadata';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { commonMiddleware, dynamoDbDocumentClient, eventBridgeClient } from '../shared';
import { StatusCodes } from 'http-status-codes';
import { BasketRepository } from '../domain/repositories/basketRepository';
import { BasketMapper, ProductMapper } from '../domain/mappers';
import { BasketService } from '../domain/services/basketService';
import { DeleteProductFromBasketParamDto, DeleteProductFromBasketResponseData } from './dtos';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { CheckoutBasketEventPublisher } from '../domain/events';

const basketRepository = new BasketRepository(dynamoDbDocumentClient, new BasketMapper(new ProductMapper()));
const basketService = new BasketService(
  basketRepository,
  new CheckoutBasketEventPublisher(eventBridgeClient),
  new LoggerService(),
);

async function deleteProductFromBasket(event: APIGatewayEvent): Promise<ProxyResult> {
  const { id: basketId, productId } = RecordToInstanceTransformer.strictTransform(
    event.pathParameters || {},
    DeleteProductFromBasketParamDto,
  );

  const basket = await basketService.removeProductFromBasket(basketId, productId);

  const responseData = new DeleteProductFromBasketResponseData(basket);

  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({
      data: responseData,
    }),
  };
}

export const handler = commonMiddleware(deleteProductFromBasket);
