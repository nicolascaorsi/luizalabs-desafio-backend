import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { defaultDataSourceOptions } from './typeorm.data-source-options.config';

export default new DataSource({
  ...defaultDataSourceOptions,
  migrations: [join(__dirname, '..', '..', 'migrations', '*.ts')],
});
