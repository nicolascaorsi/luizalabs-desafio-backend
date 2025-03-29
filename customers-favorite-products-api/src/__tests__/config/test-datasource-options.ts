import { defaultDataSourceOptions } from '@config/typeorm.data-source-options.config';
import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const getTestDataSourceOptions = (
  url: string,
  schema: string | undefined = undefined,
): DataSourceOptions =>
  <PostgresConnectionOptions>{
    ...defaultDataSourceOptions,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    url: globalThis.postgresConnectionUri,
    schema,
    // logging: true,
  };
