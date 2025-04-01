import { CreateCustomerRequest } from '@customers/business/create-customer-request';
import { CustomersService } from '@customers/business/customers.service';
import { Customer } from '@customers/domain/customer.entity';
import { FindPaginatedOptions } from '@customers/persistence/customers-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';
import { randomUUID } from 'node:crypto';
import { CustomersController } from '../customers.controller';
import { UpdateCustomerRequest } from '../dto/update-customer-request';

describe('CustomersController', () => {
  let controller: CustomersController;
  const mockCustomersService: CustomersService = mock<CustomersService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  describe('create', () => {
    it('should call service with request body and return created customer', async () => {
      const request: CreateCustomerRequest = mock();
      const expectedCustomer = mock<Customer>();
      when(mockCustomersService.create)
        .calledWith(request)
        .mockResolvedValue(expectedCustomer);

      const result = await controller.create(request);

      expect(result).toBe(expectedCustomer);
    });
  });

  describe('update', () => {
    it('should call service with provided update data', async () => {
      const customerId = randomUUID();
      const request: UpdateCustomerRequest = mock();

      await expect(
        controller.update(customerId, request),
      ).resolves.not.toThrow();
      expect(mockCustomersService.update).toHaveBeenCalledWith({
        id: customerId,
        ...request,
      });
    });
  });

  describe('find', () => {
    it('should call service with provided customer id', async () => {
      const id = 'id-123';
      const expectedResult = mock<Customer>();
      when(mockCustomersService.find)
        .calledWith({ id })
        .mockResolvedValue(expectedResult);

      const result = await controller.find(id);

      expect(result).toBe(expectedResult);
    });
  });

  describe('findPaginated', () => {
    it('should call service with provided page and pageSize', async () => {
      const expectedResult = [mock<Customer>()];
      when(mockCustomersService.findPaginated)
        .calledWith(<FindPaginatedOptions>{ page: 1, pageSize: 10 })
        .mockResolvedValue(expectedResult);

      const result = await controller.findPaginated(1, 10);

      expect(result).toBe(expectedResult);
    });
  });
  describe('delete', () => {
    it('should call service with provided id to delete', async () => {
      const customerId = randomUUID();

      await expect(controller.delete(customerId)).resolves.not.toThrow();
      expect(mockCustomersService.delete).toHaveBeenCalledWith(customerId);
    });
  });
});
