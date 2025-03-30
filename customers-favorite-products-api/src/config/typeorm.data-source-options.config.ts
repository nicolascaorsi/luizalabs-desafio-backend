import { CustomerFavoritedProductTypeOrm } from '@customers/persistence/typeorm/favorited-product.typeorm';
import { ProductTypeOrm } from '@products/persistence/typeorm/product.typeorm';
import { types } from 'pg';
import { DataSourceOptions } from 'typeorm';
import { CustomerTypeOrm } from '../features/customers/persistence/typeorm/customer.typeorm';

// Configurando o parser do tipo numeric para float, pois por padrão o driver configura para string,
// uma vez que o tamanho máximo numérico do javascript não pode ser representado no postgres,
// porém estamos trabalhando com valores menores, então é seguro converter para float
types.setTypeParser(1700, parseFloat);

export const defaultDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  entities: [CustomerTypeOrm, ProductTypeOrm, CustomerFavoritedProductTypeOrm],
  logging: process.env.TYPEORM_LOGGING == 'true',
};
