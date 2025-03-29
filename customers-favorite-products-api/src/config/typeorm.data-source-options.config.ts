import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { CustomerTypeOrm } from '../features/customers/persistence/typeorm/customer.typeorm';
import { CustomerFavoritedProductTypeOrm } from '../features/favorite-products/persistence/typeorm/favorited-product.typeorm';
import { ProductTypeOrm } from '../features/favorite-products/persistence/typeorm/product.typeorm';
export const defaultDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [CustomerTypeOrm, ProductTypeOrm, CustomerFavoritedProductTypeOrm],
  logging: process.env.TYPEORM_LOGGING == 'true',
};
export default registerAs('database', () => defaultDataSourceOptions);
