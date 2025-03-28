import { CustomerTypeOrm } from '@customers/persistence/typeorm/customer.typeorm';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [CustomerTypeOrm],
  // synchronize: true,
  // dropSchema: true,
  logging: process.env.TYPEORM_LOGGING == 'true',
  migrations: [join(__dirname, '..', '..', 'migrations', '*.ts')],
});
