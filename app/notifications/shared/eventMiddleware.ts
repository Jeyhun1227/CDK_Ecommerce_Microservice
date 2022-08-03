import middy from '@middy/core';
import errorLogger from '@middy/error-logger';

export const eventMiddleware = (handler: any) => middy(handler).use([errorLogger()]);
