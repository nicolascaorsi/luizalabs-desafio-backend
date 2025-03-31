import { Customer } from '@customers/domain/customer.entity';
import { CustomerTypeOrm } from '@customers/persistence/typeorm/customer.typeorm';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TestDataSource } from '__tests__/config/test-data-source';
import { App } from 'supertest/types';
export async function insertCustomer(
  dataSource: TestDataSource,
  count: number,
) {
  const customers = [...Array(count).keys()].map(
    (i) => new Customer({ name: `User ${i}`, email: `email-${i}@mail.com` }),
  );
  await dataSource.getRepository(CustomerTypeOrm).insert(customers);
  return customers.map((c) => new Customer(c));
}

export function getJwtToken(
  app: INestApplication<App>,
  customer: Customer,
): string {
  const payload = { sub: customer.id, user: customer };
  return app.get(JwtService).sign(payload);
}
