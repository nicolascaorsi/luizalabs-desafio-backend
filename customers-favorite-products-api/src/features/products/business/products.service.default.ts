import { HttpRequestDispatcher } from '@products/business/request-dispatcher';
import { Product } from '@products/domain/product.entity';
import { ProductsRepository } from '@products/persistence/products-repository';
import { FindProductOptions, ProductsService } from './products.service';

export class ProductsServiceDefault implements ProductsService {
  constructor(
    private repository: ProductsRepository,
    private requestDispatcher: HttpRequestDispatcher,
    private productsApiUrl: string,
  ) {}

  async save(product: Product): Promise<Product> {
    const productToCreate = new Product(product);
    return this.repository.save(productToCreate);
  }

  async existsOrThrow(options: FindProductOptions): Promise<Product> {
    const locallyPersistedProduct = await this.repository.find({
      id: options.id,
    });
    if (locallyPersistedProduct) return locallyPersistedProduct;

    const productUrl = `${this.productsApiUrl}/products/${options.id}`;
    const result = await this.requestDispatcher.get<Product>(productUrl);
    if (result.success) {
      const product = new Product(result.success);
      return await this.repository.save(product);
    }
    throw result.error;
  }
}
