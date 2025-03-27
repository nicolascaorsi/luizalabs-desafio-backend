import { UpdateData } from '@customers/persistence/customers-repository';
import { Logger } from 'config/logger';
import { DataSource, Repository } from 'typeorm';
import { Customer } from '../../../../domain/customer.entity';
import { EmailDuplicatedError } from '../../../../domain/email-duplicated-error';
import { CustomerTypeOrm } from '../../customer.typeorm';
import { CustomersRepositoryTypeOrm } from '../../customers-repository-typeorm';
import { IntegrationTestDataSource } from './integration-test-data-source';

describe('CustomersRepositoryTypeOrm Integration Test', () => {
  let dataSource: DataSource;
  let customersRepository: CustomersRepositoryTypeOrm;
  let rawTypeOrmRepository: Repository<CustomerTypeOrm>;

  beforeAll(async () => {
    dataSource = new IntegrationTestDataSource(
      'test_customer_repository',
      globalThis.postgresConnectionUri,
    );
    await dataSource.initialize();
    const loggerMock: Logger = {
      error: jest.fn(),
    };
    rawTypeOrmRepository = dataSource.getRepository(CustomerTypeOrm);
    customersRepository = new CustomersRepositoryTypeOrm(
      rawTypeOrmRepository,
      loggerMock,
    );
  });

  afterAll(async () => {
    await dataSource?.destroy();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const customerToInsert = new Customer({
        name: 'John',
        email: 'john@test.com',
      });

      const insertedCustomer =
        await customersRepository.create(customerToInsert);
      const [customersInDatabase, customersCount] =
        await rawTypeOrmRepository.findAndCount();

      expect(insertedCustomer).toEqual(customerToInsert);
      expect(customersCount).toBe(1);
      expect(customersInDatabase[0]).toEqual(<CustomerTypeOrm>{
        ...customerToInsert,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw EmailDuplicatedError when a previous customer has registered email before', async () => {
      const customerToInsert1 = new Customer({
        name: 'Masters',
        email: 'mastodonte@test.com',
      });
      const customerToInsert2 = new Customer({
        name: 'Claudinho',
        email: 'mastodonte@test.com',
      });

      await customersRepository.create(customerToInsert1);

      await expect(
        customersRepository.create(customerToInsert2),
      ).rejects.toThrow(new EmailDuplicatedError(customerToInsert1.email));
    });
  });

  describe('update', () => {
    it('should update a customer normalizing email', async () => {
      const customer = new Customer({ name: 'John', email: 'john@test.com' });
      await rawTypeOrmRepository.insert(customer);

      const customerWithUpdates: UpdateData = {
        id: customer.id,
        name: 'John Updated',
        email: 'john-UPDATED@test.com',
      };
      await customersRepository.update(customerWithUpdates);

      expect(
        await rawTypeOrmRepository.findOneBy({ id: customer.id }),
      ).toMatchObject(<CustomerTypeOrm>{
        name: customerWithUpdates.name,
        email: customerWithUpdates.email?.toLocaleLowerCase(),
      });
    });

    it('should throw EmailDuplicatedError when a previous customer has registered email', async () => {
      const customer = new Customer({
        name: 'Masters',
        email: 'mastodonte@test.com',
      });
      const customer2 = new Customer({
        name: 'Masters',
        email: 'customer2@test.com',
      });
      await rawTypeOrmRepository.insert([customer, customer2]);

      const customerWithSameEmail: UpdateData = {
        id: customer2.id,
        email: 'mastodonte@test.com',
      };
      await expect(
        customersRepository.update(customerWithSameEmail),
      ).rejects.toThrow(new EmailDuplicatedError(customer.email));
    });
  });

  describe('find', () => {
    it('should find existing customer', async () => {
      const customer = new Customer({ name: 'John', email: 'john@test.com' });
      await rawTypeOrmRepository.insert(customer);

      const foundUser = await customersRepository.find({ id: customer.id });

      expect(foundUser).toEqual<Customer>({
        id: customer.id,
        email: customer.email,
        name: customer.name,
      });
    });

    it('should return null when customer not exists', async () => {
      expect(await customersRepository.find({ id: 'ABC' })).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should paginate customers', async () => {
      const customers = [...Array(10).keys()].map(
        (i) =>
          new Customer({ name: `User ${i}`, email: `email-${i}@mail.com` }),
      );
      await rawTypeOrmRepository.insert(customers);

      const page1 = await customersRepository.findPaginated({
        page: 1,
        pageSize: 4,
      });
      const page2 = await customersRepository.findPaginated({
        page: 2,
        pageSize: 4,
      });
      const page3 = await customersRepository.findPaginated({
        page: 3,
        pageSize: 4,
      });
      const page4 = await customersRepository.findPaginated({
        page: 4,
        pageSize: 4,
      });

      expect(page1).toHaveLength(4);
      expect(page2).toHaveLength(4);
      expect(page3).toHaveLength(2);
      expect(page4).toHaveLength(0);
      expect(page1[0]).toBeInstanceOf(Customer);
    });
  });

  describe('delete', () => {
    it('should delete existing customer', async () => {
      const customer = new Customer({
        name: 'Caludomiro',
        email: `email@mail.com`,
      });
      await rawTypeOrmRepository.insert(customer);

      await customersRepository.delete(customer.id);

      expect(
        await rawTypeOrmRepository.findOneBy({ id: customer.id }),
      ).toBeNull();
    });

    it('should not throw error when customer does not exists', async () => {
      expect(await customersRepository.delete('abc')).toBeUndefined();
    });
  });
});
