import 'reflect-metadata';
import { SQSEvent } from 'aws-lambda';
import { LoggerService, RecordToInstanceTransformer } from '../../common';
import { eventMiddleware, simpleEmailServiceClient } from '../shared';
import { EmailService } from '../domain/services/emailService';
import { OrderCreatedDto } from './dtos';

const emailService = new EmailService(simpleEmailServiceClient, new LoggerService());

async function createOrder(event: SQSEvent): Promise<void> {
  const eventActions = event.Records.map(async (record) => {
    const recordDetail = JSON.parse(record.body).detail;

    const orderCreatedDto = RecordToInstanceTransformer.strictTransform(recordDetail, OrderCreatedDto);

    await emailService.sendOrderCreatedEmail(orderCreatedDto);
  });

  await Promise.all(eventActions);
}

export const handler = eventMiddleware(createOrder);
