import { CreateFavoriteRequest } from '@customers/api/dto/create-favorite-request';
import { Customer } from '@customers/domain/customer.entity';
import { CustomerTypeOrm } from '@customers/persistence/typeorm/customer.typeorm';
import { CustomerFavoritedProductTypeOrm } from '@customers/persistence/typeorm/favorited-product.typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@products/domain/product.entity';
import { ProductTypeOrm } from '@products/persistence/typeorm/product.typeorm';
import { randomUUID } from 'node:crypto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { TestDataSource } from '../config/test-data-source';
import { TestDatabaseModule } from '../config/test-database.module';

describe('Favorites (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication<App>;
  let dataSource: TestDataSource;

  beforeAll(async () => {
    dataSource = new TestDataSource('test_favorites_api');
    await dataSource.initialize();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule.forRoot(dataSource.schema))
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dataSource?.destroy();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('deve retornar os favoritos do usuário', async () => {
    const [customer, product] = await insertCustomerWithFavorite(dataSource);

    const listMyFavoritesResponse = await request(app.getHttpServer())
      .get(`/customers/${customer.id}/favorites`)
      .send(<CreateFavoriteRequest>{
        productId: product.id,
      });

    expect(listMyFavoritesResponse.statusCode).toBe(200);
    expect(Array.isArray(listMyFavoritesResponse.body)).toBe(true);
    expect(listMyFavoritesResponse.body).toHaveLength(1);
  });

  it('deve conseguir adicionar um novo produto como favorito', async () => {
    const [customer] = await insertCustomer(dataSource, 1);
    const [product] = await insertProducts(dataSource, 1);

    const response = await request(app.getHttpServer())
      .post(`/customers/${customer.id}/favorites`)
      .send(<CreateFavoriteRequest>{
        productId: product.id,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(product);
  });

  it('Um produto não pode ser adicionado em uma lista caso ele não exista', async () => {
    const [customer] = await insertCustomer(dataSource, 1);

    const response = await request(app.getHttpServer())
      .post(`/customers/${customer.id}/favorites`)
      .send(<CreateFavoriteRequest>{
        productId: randomUUID(),
      });

    expect(response.statusCode).toBe(404);
  });

  it('deve deletar corretamente um produto da lista de favoritos', async () => {
    const [customer, product] = await insertCustomerWithFavorite(dataSource);

    const response = await request(app.getHttpServer())
      .delete(`/customers/${customer.id}/favorites/${product.id}`)
      .send();

    expect(response.statusCode).toBe(204);
  });

  it('deve retornar sucesso quando deletar um produto que não faz parte da lista de favoritos', async () => {
    const [customer] = await insertCustomer(dataSource, 1);

    const response = await request(app.getHttpServer())
      .delete(`/customers/${customer.id}/favorites/${randomUUID()}`)
      .send();

    expect(response.statusCode).toBe(204);
  });

  it('deve retornar sucesso ao incluir um produto repetido nos favoritos', async () => {
    const [customer, product] = await insertCustomerWithFavorite(dataSource);

    const addFavoriteResponse = await request(app.getHttpServer())
      .post(`/customers/${customer.id}/favorites`)
      .send(<CreateFavoriteRequest>{
        productId: product.id,
      });
    const listMyFavoritesResponse = await request(app.getHttpServer())
      .get(`/customers/${customer.id}/favorites`)
      .send(<CreateFavoriteRequest>{
        productId: product.id,
      });

    expect(addFavoriteResponse.statusCode).toBe(201);
    expect(Array.isArray(listMyFavoritesResponse.body)).toBe(true);
    expect(listMyFavoritesResponse.body).toHaveLength(1);
  });
});

async function insertCustomer(dataSource: TestDataSource, count: number) {
  const customers = [...Array(count).keys()].map(
    (i) => new Customer({ name: `User ${i}`, email: `email-${i}@mail.com` }),
  );
  await dataSource.getRepository(CustomerTypeOrm).insert(customers);
  return customers.map((c) => new Customer(c));
}

async function insertProducts(dataSource: TestDataSource, count: number) {
  const products = [...Array(count).keys()].map(
    (i) =>
      new Product({
        id: randomUUID(),
        price: 5027.28,
        image: `https://picsum.photos/id/${i}/200/300`,
        brand: `Brand ${i}`,
        title: `Product ${i}`,
        reviewScore: 3.99,
      }),
  );
  await dataSource.getRepository(ProductTypeOrm).insert(products);
  return products.map((p) => new Product(p));
}

async function insertCustomerWithFavorite(dataSource: TestDataSource) {
  const customer = new Customer({
    id: randomUUID(),
    name: `User`,
    email: `email@mail.com`,
  });
  const product = new Product({
    id: randomUUID(),
    price: 5027.28,
    image: 'https://picsum.photos/id/3/200/300',
    brand: 'Brand qshjz',
    title: `Product`,
    reviewScore: 3.99,
  });

  await dataSource.getRepository(ProductTypeOrm).insert({ ...product });
  await dataSource.getRepository(CustomerTypeOrm).insert({
    ...customer,
  });
  await dataSource.getRepository(CustomerFavoritedProductTypeOrm).insert({
    customerId: customer.id,
    productId: product.id,
  });

  return [customer, product];
}
