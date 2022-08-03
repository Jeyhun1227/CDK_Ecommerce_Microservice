import { ProductNotFoundError } from '../errors';
import { ProductDto } from '../dtos';
import { Product } from '../entities';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { ProductMapper } from '../mappers';
import { v4 as uuid4 } from 'uuid';

export class ProductRepository {
  public constructor(
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    private readonly productMapper: ProductMapper,
  ) {}

  public async createOne(productData: Product): Promise<ProductDto> {
    productData.id = uuid4();

    await this.dynamoDBDocumentClient.send(
      new PutCommand({
        TableName: process.env.DB_TABLE_NAME,
        Item: productData,
      }),
    );

    const createdProduct = await this.findOne(productData.id);

    if (!createdProduct) {
      throw new ProductNotFoundError(productData.id);
    }

    return createdProduct;
  }

  public async findOne(id: string): Promise<ProductDto | null> {
    const { Item } = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: { id },
      }),
    );

    if (!Item) {
      return null;
    }

    return this.productMapper.mapEntityToDto(Item);
  }

  public async exists(id: string): Promise<boolean> {
    const { Item } = await this.dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: { id },
      }),
    );

    return Item ? true : false;
  }

  public async findMany(): Promise<ProductDto[]> {
    const { Items } = await this.dynamoDBDocumentClient.send(
      new ScanCommand({
        TableName: process.env.DB_TABLE_NAME,
      }),
    );

    const products = Items || [];

    return products.map((product) => this.productMapper.mapEntityToDto(product));
  }

  public async updateOne(id: string, productData: Partial<Omit<Product, 'id'>>): Promise<ProductDto> {
    const productExists = await this.exists(id);

    if (!productExists) {
      throw new ProductNotFoundError(id);
    }

    // @ts-ignore
    const productDataKeysWithDefinedValues = Object.keys(productData).filter((key) => productData[key]);

    const response = await this.dynamoDBDocumentClient.send(
      new UpdateCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${productDataKeysWithDefinedValues
          .map((_, index) => `#key${index} = :value${index}`)
          .join(', ')}`,
        ExpressionAttributeNames: productDataKeysWithDefinedValues.reduce(
          (previousValue, currentValue, index) => ({
            ...previousValue,
            [`#key${index}`]: currentValue,
          }),
          {},
        ),
        ExpressionAttributeValues: productDataKeysWithDefinedValues.reduce(
          (previousValue, currentValue, index) => ({
            ...previousValue,
            // @ts-ignore
            [`:value${index}`]: productData[currentValue],
          }),
          {},
        ),
        ReturnValues: 'ALL_NEW',
      }),
    );

    const updatedProduct = response.Attributes || {};

    return this.productMapper.mapEntityToDto(updatedProduct);
  }

  public async removeOne(id: string): Promise<void> {
    const productExists = await this.exists(id);

    if (!productExists) {
      throw new ProductNotFoundError(id);
    }

    await this.dynamoDBDocumentClient.send(
      new DeleteCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: { id },
      }),
    );
  }
}
