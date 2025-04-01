import { ProductsService } from '@products/business/products.service';
import { Product } from '@products/domain/product.entity';
import { Customer } from '../domain/customer.entity';
import {
  CustomersRepository,
  FindOptions,
  FindPaginatedOptions,
  UpdateData,
} from '../persistence/customers-repository';
import { CreateCustomerRequest } from './create-customer-request';
import { CustomersService } from './customers.service';

export class CustomersServiceDefault implements CustomersService {
  constructor(
    private repository: CustomersRepository,
    private productsService: ProductsService,
  ) {}

  async create(request: CreateCustomerRequest): Promise<Customer> {
    const customerToCreate = new Customer(request);
    return this.repository.create(customerToCreate);
  }

  async update(customerData: UpdateData): Promise<void> {
    await this.repository.update(customerData);
  }

  async find(options: FindOptions): Promise<Customer | null> {
    return await this.repository.find(options);
  }

  async findPaginated(options: FindPaginatedOptions): Promise<Customer[]> {
    return await this.repository.findPaginated(options);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async addFavorite(customerId: string, productId: string): Promise<Product> {
    const product = await this.productsService.existsOrThrow({
      id: productId,
    });

    await this.repository.addFavorite(customerId, productId);
    return product;
  }

  async deleteFavorite(customerId: string, productId: string): Promise<void> {
    await this.repository.deleteFavorite(customerId, productId);
  }

  async findFavoritesPaginated(
    customerId: string,
    options: FindPaginatedOptions,
  ): Promise<Product[]> {
    return await this.repository.findFavoritesPaginated(customerId, options);
  }
}
