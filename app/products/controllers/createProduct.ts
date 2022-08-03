import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { commonMiddleware, dynamoDbDocumentClient } from '../shared';
import { StatusCodes } from 'http-status-codes';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { CreateProductBodyDto, CreateProductResponseData } from './dtos';
import { ProductRepository } from '../domain/repositories/productRepository';
import { ProductMapper } from '../domain/mappers';
import { ProductService } from '../domain/services/productService';

const productRepository = new ProductRepository(dynamoDbDocumentClient, new ProductMapper());
const productService = new ProductService(productRepository, new LoggerService());

async function createProduct(event: APIGatewayEvent): Promise<ProxyResult> {
  const createProductBodyDto = RecordToInstanceTransformer.strictTransform(
    event.body ? JSON.parse(event.body) : {},
    CreateProductBodyDto,
  );

  const product = await productService.createProduct(createProductBodyDto);

  const responseData = new CreateProductResponseData(product);

  return {
    statusCode: StatusCodes.CREATED,
    body: JSON.stringify({
      data: responseData,
    }),
  };
}

export const handler = commonMiddleware(createProduct);
