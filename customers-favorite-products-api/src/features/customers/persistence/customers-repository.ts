import { Customer } from '@customers/domain/customer.entity';
import { Product } from '@products/domain/product.entity';

export type UpdateData = Partial<Customer> & Pick<Customer, 'id'>;
export type FindOptions = Partial<Customer>;
export type FindPaginatedOptions = { page: number; pageSize: number };

export abstract class CustomersRepository {
  abstract create(customer: Customer): Promise<Customer>;
  abstract update(customerData: UpdateData): Promise<void>;
  abstract find(options: FindOptions): Promise<Customer | null>;
  abstract findPaginated(options: FindPaginatedOptions): Promise<Customer[]>;
  abstract delete(id: string): Promise<void>;
  abstract addFavorite(customerId: string, productId: string): Promise<void>;
  abstract deleteFavorite(customerId: string, productId: string): Promise<void>;
  abstract findFavoritesPaginated(
    customerId: string,
    options: FindPaginatedOptions,
  ): Promise<Product[]>;
}
