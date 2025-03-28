import { Logger } from '@config/logger';
import { UnexpectedError } from '@config/unexpected-error';
import { CustomerNotFoundError } from '@customers/domain/customer-not-found-error';
import { Customer } from '@customers/domain/customer.entity';
import { EmailDuplicatedError } from '@customers/domain/email-duplicated-error';
import {
  CustomersRepository,
  FindOptions,
  FindPaginatedOptions,
} from '@customers/persistence/customers-repository';
import { Repository, UpdateResult } from 'typeorm';
import { CustomerTypeOrm, UQ_CUSTOMER_EMAIL } from './customer.typeorm';

export class CustomersRepositoryTypeOrm implements CustomersRepository {
  constructor(
    private customersRepository: Repository<CustomerTypeOrm>,
    private readonly logger: Logger,
  ) {}
  async create(customer: Customer): Promise<Customer> {
    try {
      await this.customersRepository.insert({ ...customer });
      return customer;
    } catch (e) {
      throw await this.convertToExpectedError(e, customer);
    }
  }
  async update(
    customerData: Partial<Customer> & Pick<Customer, 'id'>,
  ): Promise<void> {
    let updateResult: UpdateResult;
    try {
      updateResult = await this.customersRepository.update(customerData.id, {
        name: customerData.name,
        email: customerData.email?.toLocaleLowerCase(),
      });
    } catch (e) {
      throw await this.convertToExpectedError(e, {
        email: customerData.email ?? '',
      });
    }
    if (updateResult?.affected === 0) throw new CustomerNotFoundError();
  }
  async find(criteria: FindOptions): Promise<Customer | null> {
    const customerTypeOrm = await this.customersRepository.findOneBy(criteria);
    if (!customerTypeOrm) return null;

    return new Customer(customerTypeOrm);
  }
  async findPaginated(options: FindPaginatedOptions): Promise<Customer[]> {
    const skip = (options.page - 1) * options.pageSize;
    const customersTypeOrm = await this.customersRepository.find({
      take: options.pageSize,
      skip,
      order: {
        createdAt: 'ASC',
      },
    });

    return customersTypeOrm.map((c) => new Customer(c));
  }

  async delete(id: string): Promise<void> {
    await this.customersRepository.delete(id);
  }

  private async convertToExpectedError(
    e: any,
    customer: Pick<Customer, 'email'>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const message = e?.message as string | undefined;
    if (message?.includes(UQ_CUSTOMER_EMAIL)) {
      return new EmailDuplicatedError(customer.email);
    }
    await this.logger.error(e);
    return new UnexpectedError();
  }
}
