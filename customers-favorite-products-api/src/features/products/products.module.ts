import { Logger } from '@config/logger';
import { Module } from '@nestjs/common';
import { ProductsService } from '@products/business/products.service';
import { HttpRequestDispatcher } from '@products/business/request-dispatcher';
import { HttpRequestDispatcherFetch } from '@products/business/request-dispatcher-fetch';
import { ProductsRepository } from '@products/persistence/products-repository';
import { DataSource } from 'typeorm';
import { ProductsServiceDefault } from './business/products.service.default';
import { ProductTypeOrm } from './persistence/typeorm/product.typeorm';
import { ProductsRepositoryTypeOrm } from './persistence/typeorm/products-repository-typeorm';

@Module({
  controllers: [],
  providers: [
    {
      provide: ProductsRepository,
      inject: [DataSource, Logger],
      useFactory: (ds: DataSource, logger: Logger) =>
        new ProductsRepositoryTypeOrm(ds.getRepository(ProductTypeOrm), logger),
    },
    {
      provide: HttpRequestDispatcher,
      useClass: HttpRequestDispatcherFetch,
    },
    {
      provide: ProductsService,
      inject: [ProductsRepository, HttpRequestDispatcher],
      useFactory: (
        repository: ProductsRepository,
        dispatcher: HttpRequestDispatcher,
      ) => new ProductsServiceDefault(repository, dispatcher),
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
