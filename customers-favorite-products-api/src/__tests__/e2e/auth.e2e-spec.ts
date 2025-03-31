import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { insertCustomer } from '../utils';

import { TokenData } from '@auth/token-data';
import { Customer } from '@customers/domain/customer.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, LoginResponse } from 'features/auth/auth.service';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { TestDataSource } from '../config/test-data-source';
import { TestDatabaseModule } from '../config/test-database.module';

describe('Authentication (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication<App>;
  let dataSource: TestDataSource;

  beforeAll(async () => {
    dataSource = new TestDataSource('auth_module');
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

  it('deve conseguir se autenticar', async () => {
    const [customer] = await insertCustomer(dataSource, 1);
    const response = await request(app.getHttpServer())
      .post(`/auth/login`)
      .send(<LoginRequest>{
        email: customer.email,
      });
    expect(response.body).toEqual(
      expect.objectContaining<LoginResponse>({
        accessToken: expect.any(String),
      }),
    );
  });

  it('deve conseguir utilizar uma rota privada quando estiver autenticado', async () => {
    const [customer] = await insertCustomer(dataSource, 1);
    const token = await getToken(app, customer);

    const response = await request(app.getHttpServer())
      .get(`/customers/${customer.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
  });

  it('não deve conseguir utilizar uma rota privada sem autenticação', async () => {
    const [customer] = await insertCustomer(dataSource, 1);

    const response = await request(app.getHttpServer())
      .get(`/customers/${customer.id}`)
      .send();

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('não deve conseguir utilizar uma rota privada com o token expirado', async () => {
    const [customer] = await insertCustomer(dataSource, 1);
    const payload: TokenData = { sub: customer.id, user: customer };
    const expiredToken = await app.get(JwtService).signAsync(payload, {
      expiresIn: '-1s',
    });

    const response = await request(app.getHttpServer())
      .get(`/customers/${customer.id}`)
      .set('Authorization', `Bearer ${expiredToken}`)
      .send();

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
async function getToken(app: INestApplication<App>, customer: Customer) {
  return await request(app.getHttpServer())
    .post(`/auth/login`)
    .send(<LoginRequest>{
      email: customer.email,
    })
    .then((r) => (r.body as LoginResponse).accessToken);
}
