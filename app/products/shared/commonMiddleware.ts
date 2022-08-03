import httpEventNormalizer from '@middy/http-event-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import { ValidationError } from '../../common';
import createError from 'http-errors';
import { ProductNotFoundError } from '../domain/errors';
import middy from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const httpErrorMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const onError: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request): Promise<void> => {
    let httpError;

    console.log(request.error);

    if (request.error instanceof ValidationError) {
      httpError = new createError.BadRequest(request.error.message);
    } else if (request.error instanceof ProductNotFoundError) {
      httpError = new createError.NotFound(request.error.message);
    } else {
      httpError = new createError.InternalServerError(JSON.stringify(request.error));
    }

    request.response = { body: JSON.stringify({ message: httpError?.message! }), statusCode: httpError?.statusCode! };
  };

  return {
    onError,
  };
};

export const commonMiddleware = (handler: any) =>
  middy(handler).use([httpHeaderNormalizer(), httpSecurityHeaders(), httpEventNormalizer(), httpErrorMiddleware()]);
