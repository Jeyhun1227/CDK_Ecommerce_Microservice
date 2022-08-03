import { LoggerService } from '../../../common';
import { OrderCreatedData } from './types';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export class EmailService {
  public constructor(
    private readonly simpleEmailServiceClient: SESClient,
    private readonly loggerService: LoggerService,
  ) {}

  public async sendOrderCreatedEmail(orderData: OrderCreatedData): Promise<void> {
    this.loggerService.debug('Sending email about created order...', { orderId: orderData.orderId });

    const emailSubject = `Order ${orderData.orderId}: Created`;

    const emailBodyOrderEntries = orderData.products.map(
      (order) => `Item: ${order.name}, quantity: ${order.amount}, price: ${order.price}`,
    );

    const emailBodyTotalPrice = `Total price: ${orderData.totalPrice}`;

    const emailBody = [...emailBodyOrderEntries, emailBodyTotalPrice].join('\n');

    const params = {
      Source: 'michal.andrzej.cieslar@gmail.com',
      Destination: {
        ToAddresses: [orderData.email],
      },
      Message: {
        Body: {
          Text: {
            Data: emailBody,
          },
        },
        Subject: {
          Data: emailSubject,
        },
      },
    };

    await this.simpleEmailServiceClient.send(new SendEmailCommand(params));

    this.loggerService.info('Email about created order send.', { orderId: orderData.orderId });
  }
}
