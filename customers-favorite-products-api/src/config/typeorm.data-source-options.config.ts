import { CustomerFavoritedProductTypeOrm } from '@customers/persistence/typeorm/favorited-product.typeorm';
import { registerAs } from '@nestjs/config';
import { ProductTypeOrm } from '@products/persistence/typeorm/product.typeorm';
import { DataSourceOptions } from 'typeorm';
import { CustomerTypeOrm } from '../features/customers/persistence/typeorm/customer.typeorm';
export const defaultDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [CustomerTypeOrm, ProductTypeOrm, CustomerFavoritedProductTypeOrm],
  logging: process.env.TYPEORM_LOGGING == 'true',
};
export default registerAs('database', () => defaultDataSourceOptions);
