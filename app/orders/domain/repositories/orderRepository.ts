import { OrderNotFoundError } from '../errors';
import { OrderDto } from '../dtos';
import { Order } from '../entities';
import { OrderMapper } from '../mappers';
import { v4 as uuid4 } from 'uuid';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

export class OrderRepository {
  public constructor(
    private readonly dynamoDbDocumentClient: DynamoDBDocumentClient,
    private readonly orderMapper: OrderMapper,
  ) {}

  public async createOne(orderData: Order): Promise<OrderDto> {
    orderData.id = uuid4();

    orderData.orderDate = new Date().toISOString();

    const totalPrice = orderData.products.reduce((accumulator, item) => {
      return accumulator + item.amount * item.price;
    }, 0);

    orderData.totalPrice = totalPrice;

    await this.dynamoDbDocumentClient.send(
      new PutCommand({
        TableName: process.env.DB_TABLE_NAME,
        Item: orderData,
      }),
    );

    const createdOrder = await this.findOne(orderData.id);

    if (!createdOrder) {
      throw new OrderNotFoundError(orderData.id);
    }

    return createdOrder;
  }

  public async findOne(id: string): Promise<OrderDto | null> {
    const { Item } = await this.dynamoDbDocumentClient.send(
      new GetCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: { id },
      }),
    );

    if (!Item) {
      return null;
    }

    return this.orderMapper.mapEntityToDto(Item);
  }

  public async exists(id: string): Promise<boolean> {
    const { Item } = await this.dynamoDbDocumentClient.send(
      new GetCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: { id },
      }),
    );

    return Item ? true : false;
  }

  public async findMany(): Promise<OrderDto[]> {
    const { Items } = await this.dynamoDbDocumentClient.send(
      new ScanCommand({
        TableName: process.env.DB_TABLE_NAME,
      }),
    );

    const orders = Items || [];

    return orders.map((order) => this.orderMapper.mapEntityToDto(order));
  }

  public async updateOne(id: string, orderData: Partial<Omit<Order, 'id'>>): Promise<OrderDto> {
    const orderExists = await this.exists(id);

    if (!orderExists) {
      throw new OrderNotFoundError(id);
    }

    // @ts-ignore
    const orderDataKeysWithDefinedValues = Object.keys(orderData).filter((key) => orderData[key]);

    const response = await this.dynamoDbDocumentClient.send(
      new UpdateCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${orderDataKeysWithDefinedValues
          .map((_, index) => `#key${index} = :value${index}`)
          .join(', ')}`,
        ExpressionAttributeNames: orderDataKeysWithDefinedValues.reduce(
          (previousValue, currentValue, index) => ({
            ...previousValue,
            [`#key${index}`]: currentValue,
          }),
          {},
        ),
        ExpressionAttributeValues: orderDataKeysWithDefinedValues.reduce(
          (previousValue, currentValue, index) => ({
            ...previousValue,
            // @ts-ignore
            [`:value${index}`]: orderData[currentValue],
          }),
          {},
        ),
        ReturnValues: 'ALL_NEW',
      }),
    );

    const updatedOrder = response.Attributes || {};

    return this.orderMapper.mapEntityToDto(updatedOrder);
  }

  public async removeOne(id: string, orderDate: string): Promise<void> {
    const orderExists = await this.exists(id);

    if (!orderExists) {
      throw new OrderNotFoundError(id);
    }

    await this.dynamoDbDocumentClient.send(
      new DeleteCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: { id },
      }),
    );
  }
}
