import { Product } from '../domain/product.entity';

export type UpdateData = Partial<Product> & Pick<Product, 'id'>;
export type FindOptions = Partial<Product>;
export type FindPaginatedOptions = { page: number; pageSize: number };

export abstract class ProductsRepository {
  abstract save(product: Product): Promise<Product>;
  abstract find(options: FindOptions): Promise<Product | null>;
}
