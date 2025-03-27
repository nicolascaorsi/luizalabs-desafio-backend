import { CreateCustomerRequest } from '@customers/api/dto/create-customer-request';
import { Customer } from '@customers/domain/customer.entity';
import {
  CustomersRepository,
  FindOptions,
  UpdateData,
} from '@customers/persistence/customers-repository';
import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';
import { CustomersServiceDefault } from '../customers.service.default';

describe('CustomersServiceDefault', () => {
  let service: CustomersServiceDefault;
  let mockRepository: CustomersRepository;

  beforeEach(() => {
    mockRepository = mock<CustomersRepository>();
    service = new CustomersServiceDefault(mockRepository);
  });

  describe('create', () => {
    it('should create customer with valid params and return created entity', async () => {
      const request: CreateCustomerRequest = {
        name: 'John',
        email: 'john@test.com',
      };
      const expectedCustomer = new Customer(request);
      when(mockRepository.create)
        .calledWith(expect.objectContaining(request))
        .mockResolvedValue(expectedCustomer);

      const result = await service.create(request);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCustomer);
    });
  });

  describe('update', () => {
    it('should proxy update data to repository', async () => {
      const updateData: UpdateData = mock();

      when(mockRepository.update)
        .calledWith(updateData)
        .mockResolvedValue(undefined);

      await service.update(updateData);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('should return the same result from repository', async () => {
      const findOptions = mock<FindOptions>();
      const expectedResult = mock<Customer>();
      when(mockRepository.find)
        .calledWith(findOptions)
        .mockResolvedValue(expectedResult);

      const result = await service.find(findOptions);

      expect(result).toBe(expectedResult);
    });
  });

  describe('delete', () => {
    it('should call delete from repository', async () => {
      when(mockRepository.delete).calledWith('123').mockResolvedValue();

      await expect(service.delete('123')).resolves.not.toThrow();
    });
  });
});
