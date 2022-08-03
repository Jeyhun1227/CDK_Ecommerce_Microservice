import Logger from 'bunyan';
import bunyan from 'bunyan';
import { LogContext } from './types';

export class LoggerService {
  private readonly instance: Logger;

  public constructor() {
    this.instance = bunyan.createLogger({ name: 'loggerService', level: 'debug' });
  }

  public fatal(message: string, context?: LogContext): void {
    this.instance.fatal({ context }, message);
  }

  public error(message: string, context?: LogContext): void {
    this.instance.error({ context }, message);
  }

  public warn(message: string, context?: LogContext): void {
    this.instance.warn({ context }, message);
  }

  public info(message: string, context?: LogContext): void {
    this.instance.info({ context }, message);
  }

  public debug(message: string, context?: LogContext): void {
    this.instance.debug({ context }, message);
  }

  public log(message: string, context?: LogContext): void {
    this.instance.info({ context }, message);
  }
}
