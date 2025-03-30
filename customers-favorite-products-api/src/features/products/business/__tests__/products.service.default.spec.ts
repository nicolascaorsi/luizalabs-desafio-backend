import { HttpRequestDispatcher } from '@products/business/request-dispatcher';
import { Product } from '@products/domain/product.entity';
import { ProductsRepository } from '@products/persistence/products-repository';
import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';
import { randomUUID } from 'node:crypto';
import { ProductsServiceDefault } from '../products.service.default';
import { DispatcherResponse } from '../request-dispatcher';
describe('ProductsServiceDefault', () => {
  let service: ProductsServiceDefault;
  let mockRepository: ProductsRepository;
  let mockHttpRequestDispatcher: HttpRequestDispatcher;
  const productsApiUrl = 'http://mock-products-server:8080';

  beforeEach(() => {
    mockRepository = mock<ProductsRepository>();
    mockHttpRequestDispatcher = mock<HttpRequestDispatcher>();
    service = new ProductsServiceDefault(
      mockRepository,
      mockHttpRequestDispatcher,
      productsApiUrl,
    );
  });

  describe('existsOrThrow', () => {
    it('should not throw when product exists in main database', async () => {
      const productId = randomUUID();
      const product = mock<Product>();
      when(mockRepository.find)
        .calledWith({ id: productId })
        .mockResolvedValue(product);

      await expect(
        service.existsOrThrow({ id: productId }),
      ).resolves.not.toThrow();
    });

    it('should add favorite when products does not exists locally', async () => {
      const productId = randomUUID();
      const product = new Product({
        id: productId,
        price: 5027.28,
        image: 'https://picsum.photos/id/3/200/300',
        brand: 'Brand qshjz',
        title: `Product ${productId}`,
        reviewScore: 3.99,
      });
      when(mockHttpRequestDispatcher.get)
        .calledWith(`${productsApiUrl}/products/${productId}`)
        .mockResolvedValue(<DispatcherResponse<Product>>{
          success: product,
        });

      await service.existsOrThrow({ id: productId });

      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(mockRepository.find).toHaveBeenCalledWith({ id: productId });
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(product);
    });
  });
});
