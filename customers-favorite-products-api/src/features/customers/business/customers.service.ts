import {
  FindOptions,
  FindPaginatedOptions,
  UpdateData,
} from '@customers/persistence/customers-repository';
import { Customer } from '../domain/customer.entity';

export class CreateCustomerRequest {
  name: string;
  email: string;
}

export type UpdateCustomerRequest = UpdateData;

export type FindCustomerOptions = FindOptions;

export type FindPaginatedCustomers = FindPaginatedOptions;

export abstract class CustomersService {
  abstract create(request: CreateCustomerRequest): Promise<Customer>;
  abstract update(customerData: UpdateData): Promise<void>;
  abstract find(options: FindOptions): Promise<Customer | null>;
  abstract findPaginated(options: FindPaginatedOptions): Promise<Customer[]>;
  abstract delete(id: string): Promise<void>;
}
