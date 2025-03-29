import { NotFoundError } from '@errors/not-found-error';
import { Product } from '@products/domain/product.entity';
import { mock } from 'jest-mock-extended';
import { HttpRequestDispatcher } from '../request-dispatcher';
import { HttpRequestDispatcherFetch } from '../request-dispatcher-fetch';

describe('HttpRequestDispatcher', () => {
  let requestDispatcher: HttpRequestDispatcher;
  beforeAll(() => {
    requestDispatcher = new HttpRequestDispatcherFetch(mock());
  });
  describe('get', () => {
    it('should return the response as generic type', async () => {
      const url = 'http://fake-api.com/api';
      const product = mock<Product>();
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
        mock<Response>({
          ok: true,
          json: jest.fn().mockResolvedValue(product),
        }),
      );

      const response = await requestDispatcher.get(url);

      expect(fetchSpy).toHaveBeenCalledWith(url);
      expect(response.success).toEqual(product);
      expect(response.error).toBeUndefined();
    });

    it('should return NotFoundError when response status code is 404', async () => {
      const url = 'http://fake-api.com/api';
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
        mock<Response>({
          ok: false,
          status: 404,
        }),
      );

      const response = await requestDispatcher.get(url);

      expect(fetchSpy).toHaveBeenCalledWith(url);
      expect(response).toEqual({ error: new NotFoundError() });
    });

    it('should return Erro when request fail and response status is not 404', async () => {
      const url = 'http://fake-api.com/api';
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
        mock<Response>({
          ok: false,
          status: 500,
        }),
      );

      const response = await requestDispatcher.get(url);

      expect(fetchSpy).toHaveBeenCalledWith(url);
      expect(response).toEqual({ error: new Error() });
    });
  });
});
