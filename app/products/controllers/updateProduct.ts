import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { commonMiddleware, dynamoDbDocumentClient } from '../shared';
import { StatusCodes } from 'http-status-codes';
import { ProductRepository } from '../domain/repositories/productRepository';
import { ProductMapper } from '../domain/mappers';
import { ProductService } from '../domain/services/productService';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { UpdateProductParamDto, UpdateProductBodyDto, UpdateProductResponseData } from './dtos';

const productRepository = new ProductRepository(dynamoDbDocumentClient, new ProductMapper());
const productService = new ProductService(productRepository, new LoggerService());

async function updateProduct(event: APIGatewayEvent): Promise<ProxyResult> {
  const { id } = RecordToInstanceTransformer.strictTransform(event.pathParameters || {}, UpdateProductParamDto);

  const updateProductBodyDto = RecordToInstanceTransformer.strictTransform(
    event.body ? JSON.parse(event.body) : {},
    UpdateProductBodyDto,
  );

  const product = await productService.updateProduct(id, updateProductBodyDto);

  const responseData = new UpdateProductResponseData(product);

  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({
      data: responseData,
    }),
  };
}

export const handler = commonMiddleware(updateProduct);
