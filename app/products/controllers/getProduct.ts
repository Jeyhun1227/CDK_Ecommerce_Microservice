import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { commonMiddleware, dynamoDbDocumentClient } from '../shared';
import { StatusCodes } from 'http-status-codes';
import { ProductRepository } from '../domain/repositories/productRepository';
import { ProductMapper } from '../domain/mappers';
import { ProductService } from '../domain/services/productService';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { GetProductParamDto, GetProductResponseData } from './dtos';

const productRepository = new ProductRepository(dynamoDbDocumentClient, new ProductMapper());
const productService = new ProductService(productRepository, new LoggerService());

async function getProduct(event: APIGatewayEvent): Promise<ProxyResult> {
  const { id } = RecordToInstanceTransformer.strictTransform(event.pathParameters || {}, GetProductParamDto);

  const product = await productService.findProduct(id);

  const responseData = new GetProductResponseData(product);

  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({
      data: responseData,
    }),
  };
}

export const handler = commonMiddleware(getProduct);
