import { Product } from '@products/domain/product.entity';

export type FindProductOptions = { id: string };
export abstract class ProductsService {
  abstract save(product: Product): Promise<Product>;
  abstract existsOrThrow(options: FindProductOptions): Promise<void>;
}
