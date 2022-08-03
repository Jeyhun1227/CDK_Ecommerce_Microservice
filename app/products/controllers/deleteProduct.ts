import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { commonMiddleware, dynamoDbDocumentClient } from '../shared';
import { StatusCodes } from 'http-status-codes';
import { ProductRepository } from '../domain/repositories/productRepository';
import { ProductMapper } from '../domain/mappers';
import { ProductService } from '../domain/services/productService';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { DeleteProductParamDto } from './dtos';

const productRepository = new ProductRepository(dynamoDbDocumentClient, new ProductMapper());
const productService = new ProductService(productRepository, new LoggerService());

async function deleteProduct(event: APIGatewayEvent): Promise<ProxyResult> {
  const { id } = RecordToInstanceTransformer.strictTransform(event.pathParameters || {}, DeleteProductParamDto);

  await productService.removeProduct(id);

  return {
    statusCode: StatusCodes.NO_CONTENT,
    body: JSON.stringify({
      data: '',
    }),
  };
}

export const handler = commonMiddleware(deleteProduct);
