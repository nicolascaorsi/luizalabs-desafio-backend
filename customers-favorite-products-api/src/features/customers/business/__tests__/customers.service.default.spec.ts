import { CreateCustomerRequest } from '@customers/api/dto/create-customer-request';
import { Customer } from '@customers/domain/customer.entity';
import {
  CustomersRepository,
  FindOptions,
  UpdateData,
} from '@customers/persistence/customers-repository';
import { ProductsService } from '@products/business/products.service';
import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';
import { CustomersServiceDefault } from '../customers.service.default';

describe('CustomersServiceDefault', () => {
  let service: CustomersServiceDefault;
  let mockRepository: CustomersRepository;
  let mockProductsService: ProductsService;

  beforeEach(() => {
    mockRepository = mock<CustomersRepository>();
    mockProductsService = mock<ProductsService>();
    service = new CustomersServiceDefault(mockRepository, mockProductsService);

    // TODO não depender diretamente da variável de ambiente
    process.env.PRODUCTS_API_URL =
      process.env.PRODUCTS_API_URL ?? 'http://mock-products-server:8080';
    // productsApiUrl = process.env.PRODUCTS_API_URL;
  });

  describe('create', () => {
    it('should create customer with valid params and return created entity', async () => {
      const request: CreateCustomerRequest = {
        name: 'John',
        email: 'john@test.com',
      };
      const expectedCustomer = new Customer(request);
      when(mockRepository.create)
        .calledWith({
          ...request,
          id: expect.any(String),
        })
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

  describe('add favorites', () => {
    it('should add favorite when products exists locally', async () => {
      const customerId = 'abc';
      const productId = '123';
      await service.addFavorite(customerId, productId);

      expect(mockProductsService.existsOrThrow).toHaveBeenCalledTimes(1);
      expect(mockProductsService.existsOrThrow).toHaveBeenCalledWith({
        id: productId,
      });
      expect(mockRepository.addFavorite).toHaveBeenCalledTimes(1);
      expect(mockRepository.addFavorite).toHaveBeenCalledWith(
        customerId,
        productId,
      );
    });
  });
});
