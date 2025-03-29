import { Logger } from '@config/logger';

import { Repository } from 'typeorm';
import { Product } from '../../domain/product.entity';
import { FindOptions, ProductsRepository } from '../products-repository';
import { ProductTypeOrm } from './product.typeorm';

export class ProductsRepositoryTypeOrm implements ProductsRepository {
  constructor(
    private productsRepository: Repository<ProductTypeOrm>,
    private readonly logger: Logger,
  ) {}
  async save(product: Product): Promise<Product> {
    await this.productsRepository.save({ ...product });
    return product;
  }
  async find(criteria: FindOptions): Promise<Product | null> {
    const productTypeOrm = await this.productsRepository.findOneBy(criteria);
    if (!productTypeOrm) return null;

    return new Product(productTypeOrm);
  }
}
