import { CustomerTypeOrm } from '@customers/persistence/typeorm/customer.typeorm';
import { DataSourceOptions } from 'typeorm';

export const getTestDataSourceOptions = (
  url: string,
  schema: string | undefined = undefined,
): DataSourceOptions => ({
  type: 'postgres',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  url: globalThis.postgresConnectionUri,
  schema,
  entities: [CustomerTypeOrm],
});
