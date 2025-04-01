import { UpdateCustomerRequest } from '@customers/business/customers.service';
import { Customer } from '@customers/domain/customer.entity';
import { CustomerTypeOrm } from '@customers/persistence/typeorm/customer.typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { TestDataSource } from '../config/test-data-source';
import { TestDatabaseModule } from '../config/test-database.module';
import { getJwtToken } from '../utils';

describe('AppController (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication<App>;
  let dataSource: TestDataSource;

  beforeAll(async () => {
    dataSource = new TestDataSource('test_customers_api');
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

  describe('/customer (POST)', () => {
    it('should insert new customer using /customer (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send(<CreateCustomerRequest>{
          email: 'john.doe@dodoe.com',
          name: 'John Dodoessos',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(<Customer>{
        id: expect.any(String),
        email: 'john.doe@dodoe.com',
        name: 'John Dodoessos',
      });
    });
    it('deve gerar um erro de validação quando o email for inválido e o nome forem', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send(<CreateCustomerRequest>{
          email: 'john.doe@dodoe.com',
          name: 'John Dodoessos',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(<Customer>{
        id: expect.any(String),
        email: 'john.doe@dodoe.com',
        name: 'John Dodoessos',
      });
    });
  });

  describe('update', () => {
    it('should update existing customer with new name and email using /customer (PATH)', async () => {
      const [customer] = await insertUsers(dataSource, 1);
      const dataToUpdate = <UpdateCustomerRequest>{
        email: 'updated@dodoe.com',
        name: 'Updated Name',
      };

      const response = await request(app.getHttpServer())
        .patch(`/customers/${customer.id}`)
        .auth(getJwtToken(app, customer), { type: 'bearer' })
        .send(dataToUpdate);
      const customerInDatabase = await dataSource
        .getRepository(CustomerTypeOrm)
        .findOneBy({ id: customer.id });

      expect(response.statusCode).toBe(204);
      expect(customerInDatabase).toMatchObject(dataToUpdate);
    });

    it('should return 404 when tries to update a customer that does not exsits /customer (PATH)', async () => {
      const customer = new Customer({
        email: 'updated@dodoe.com',
        name: 'Updated Name',
      });

      const response = await request(app.getHttpServer())
        .patch(`/customers/${customer.id}`)
        .auth(getJwtToken(app, customer), { type: 'bearer' })
        .send(customer);

      expect(response.statusCode).toBe(404);
    });
  });
  it('should find a customer by id using /customer/:id (GET)', async () => {
    const [customer] = await insertUsers(dataSource, 1);

    const response = await request(app.getHttpServer())
      .get(`/customers/${customer.id}`)
      .auth(getJwtToken(app, customer), { type: 'bearer' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(customer);
  });

  it('não deve permitir acesso aos dados de um customer que não seja o usuário logado using /customer/:id (GET)', async () => {
    const [customer, customer2] = await insertUsers(dataSource, 2);

    const response = await request(app.getHttpServer())
      .get(`/customers/${customer.id}`)
      .auth(getJwtToken(app, customer2), { type: 'bearer' });

    expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
  });

  describe('find paginated TODO: somente deve permitir listagem para adminsitradores', () => {
    it.skip('should paginate with inserted order', async () => {
      const customers = await insertUsers(dataSource, 3);

      const page1Response = await request(app.getHttpServer())
        .get(`/customers?pageSize=2&page=1`)
        .send();

      const page2Response = await request(app.getHttpServer())
        .get(`/customers?pageSize=2&page=2`)
        .send();

      expect(page1Response.statusCode).toBe(200);
      expect(page1Response.body).toEqual([customers[0], customers[1]]);

      expect(page2Response.statusCode).toBe(200);
      expect(page2Response.body).toEqual([customers[2]]);
    });
  });

  describe('find customer', () => {
    it('should find customer by given id', async () => {
      const [customer] = await insertUsers(dataSource, 1);

      const findResponse = await request(app.getHttpServer())
        .get(`/customers/${customer.id}`)
        .auth(getJwtToken(app, customer), { type: 'bearer' })
        .send();

      expect(findResponse.statusCode).toBe(200);
      expect(findResponse.body).toEqual(customer);
    });

    it.skip('should return 404 when customer does not exists TODO deve retornar erro uma vez que o usuário não está autenticado', async () => {
      const findResponse = await request(app.getHttpServer())
        .get(`/customers/${randomUUID()}`)
        .send();

      expect(findResponse.statusCode).toBe(404);
      expect(findResponse.body).toEqual({
        message: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('delete', () => {
    it('should delete customer by given id', async () => {
      const [customer] = await insertUsers(dataSource, 1);

      const findResponse = await request(app.getHttpServer())
        .delete(`/customers/${customer.id}`)
        .auth(getJwtToken(app, customer), { type: 'bearer' })
        .send();

      expect(findResponse.statusCode).toBe(204);
      expect(findResponse.body).toEqual({});
    });
  });
});

async function insertUsers(dataSource: TestDataSource, count: number) {
  const customers = [...Array(count).keys()].map(
    (i) => new Customer({ name: `User ${i}`, email: `email-${i}@mail.com` }),
  );
  await dataSource.getRepository(CustomerTypeOrm).insert(customers);
  return customers.map((c) => new Customer(c));
}
