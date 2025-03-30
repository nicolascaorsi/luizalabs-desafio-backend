import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { defaultDataSourceOptions } from './typeorm.data-source-options.config';

export default new DataSource(<PostgresConnectionOptions>{
  ...defaultDataSourceOptions,
  migrations: [join(__dirname, '..', '..', 'migrations', '*.ts')],
  url: process.env.DATABASE_URL,
});
