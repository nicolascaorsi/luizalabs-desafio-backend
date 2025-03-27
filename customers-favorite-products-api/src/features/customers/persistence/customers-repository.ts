import { Customer } from '@customers/domain/customer.entity';

export type UpdateData = Partial<Customer> & Pick<Customer, 'id'>;
export type FindOptions = Partial<Customer>;
export type FindPaginatedOptions = { page: number; pageSize: number };

export abstract class CustomersRepository {
  abstract create(customer: Customer): Promise<Customer>;
  abstract update(customerData: UpdateData): Promise<void>;
  abstract find(options: FindOptions): Promise<Customer | null>;
  abstract findPaginated(options: FindPaginatedOptions): Promise<Customer[]>;
}
