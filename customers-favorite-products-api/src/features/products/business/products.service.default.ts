import { HttpRequestDispatcher } from '@products/business/request-dispatcher';
import { Product } from '@products/domain/product.entity';
import { ProductsRepository } from '@products/persistence/products-repository';
import { FindProductOptions, ProductsService } from './products.service';

export class ProductsServiceDefault implements ProductsService {
  constructor(
    private repository: ProductsRepository,
    private requestDispatcher: HttpRequestDispatcher,
  ) {}

  async save(product: Product): Promise<Product> {
    const productToCreate = new Product(product);
    return this.repository.save(productToCreate);
  }

  async existsOrThrow(options: FindProductOptions): Promise<void> {
    const locallyPersistedProduct = await this.repository.find({
      id: options.id,
    });
    if (!locallyPersistedProduct) {
      const productsApiUrl = process.env.PRODUCTS_API_URL;
      const productUrl = `${productsApiUrl}/products/${options.id}`;
      const result = await this.requestDispatcher.get<Product>(productUrl);
      if (result.success) {
        const product = new Product(result.success);
        await this.repository.save(product);
        return;
      }
      throw result.error;
    }
  }
}
