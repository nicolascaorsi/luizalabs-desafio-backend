import { Logger } from '@config/logger';
import { NotFoundError } from '@errors/not-found-error';
import e from 'express';
import {
  DispatcherResponse,
  HttpRequestDispatcher,
} from './request-dispatcher';

export class HttpRequestDispatcherFetch implements HttpRequestDispatcher {
  constructor(private logger: Logger) {}

  async get<T>(url: string): Promise<DispatcherResponse<T>> {
    const result = await fetch(url);
    const success = result.ok;
    if (success)
      return {
        success: (await result.json()) as T,
      };

    if (result.status == 404) {
      return {
        error: new NotFoundError(),
      };
    }
    await this.logger.error(e);
    return { error: new Error() };
  }
}
