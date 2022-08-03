import { OrderDto } from '../dtos';
import { CreateOrderData } from './types';
import { LoggerService } from '../../../common';
import { OrderRepository } from '../repositories/orderRepository';
import { CreateOrderEventPublisher } from '../events';

export class OrderService {
  public constructor(
    private readonly orderRepository: OrderRepository,
    private readonly createOrderEventPublisher: CreateOrderEventPublisher,
    private readonly loggerService: LoggerService,
  ) {}

  public async createOrder(orderData: CreateOrderData): Promise<OrderDto> {
    this.loggerService.debug('Creating order...', { ...orderData });

    const order = await this.orderRepository.createOne(orderData);

    await this.createOrderEventPublisher.publish({
      orderId: order.id,
      email: order.email,
      products: order.products,
      totalPrice: order.totalPrice,
    });

    this.loggerService.info('Order created.', { orderId: order.id });

    return order;
  }

  public async findOrders(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findMany();

    return orders;
  }
}
