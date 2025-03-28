import { Logger } from './logger';

export class ConsoleLogger extends Logger {
  error(message: any, ...optionalParams: any[]): Promise<void> {
    return Promise.resolve(console.log(message, optionalParams));
  }
}
