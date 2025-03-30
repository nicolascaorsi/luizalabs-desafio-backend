import { Logger } from 'config/logger';
import { DataSource, Repository } from 'typeorm';
import { TestDataSource } from '../../../../../../__tests__/config/test-data-source';
import { Product } from '../../../../domain/product.entity';

import { randomUUID } from 'node:crypto';
import { ProductTypeOrm } from '../../product.typeorm';
import { ProductsRepositoryTypeOrm } from '../../products-repository-typeorm';

describe('ProductsRepositoryTypeOrm Integration Test', () => {
  let dataSource: DataSource;
  let productsRepository: ProductsRepositoryTypeOrm;
  let rawTypeOrmRepository: Repository<ProductTypeOrm>;

  beforeAll(async () => {
    dataSource = new TestDataSource('test_product_repository');
    await dataSource.initialize();
    const loggerMock: Logger = {
      error: jest.fn(),
    };
    rawTypeOrmRepository = dataSource.getRepository(ProductTypeOrm);
    productsRepository = new ProductsRepositoryTypeOrm(
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

  describe('save', () => {
    it('should create a product when not exists', async () => {
      const productToInsert = new Product({
        id: randomUUID(),
        brand: 'Xalingo',
        image: 'http://teste.com',
        price: 50_000,
        title: 'Abaco radical',
      });

      const insertedProduct = await productsRepository.save(productToInsert);
      const [productsInDatabase, productsCount] =
        await rawTypeOrmRepository.findAndCount();

      expect(insertedProduct).toEqual(productToInsert);
      expect(productsCount).toBe(1);
      expect(productsInDatabase[0]).toEqual({
        ...productToInsert,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerFavoritedProducts: undefined,
        reviewScore: null,
      });
    });

    it('should update a product when it exists', async () => {
      const product = new Product({
        id: randomUUID(),
        brand: 'Xalingo',
        image: 'http://teste.com',
        price: 50_000,
        title: 'Abaco radical',
        reviewScore: 3,
      });
      await productsRepository.save(product);
      const updatedProduct = new Product({
        id: product.id,
        brand: 'Xalingo Editado',
        image: 'http://teste-editado.com',
        price: 51_000,
        title: 'Abaco radical editado',
        reviewScore: 5,
      });
      await productsRepository.save(updatedProduct);

      const [productsInDatabase, productsCount] =
        await rawTypeOrmRepository.findAndCount();

      expect(productsCount).toBe(1);
      expect(updatedProduct).toMatchObject(
        expect.objectContaining({
          id: productsInDatabase[0].id,
          price: productsInDatabase[0].price,
          image: productsInDatabase[0].image,
          brand: productsInDatabase[0].brand,
          title: productsInDatabase[0].title,
          reviewScore: productsInDatabase[0].reviewScore,
        }),
      );
    });
  });
});
