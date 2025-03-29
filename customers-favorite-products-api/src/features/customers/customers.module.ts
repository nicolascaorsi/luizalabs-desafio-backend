import { Logger } from '@config/logger';
import { CustomersRepository } from '@customers/persistence/customers-repository';
import { Module } from '@nestjs/common';
import { ProductsService } from '@products/business/products.service';
import { ProductsModule } from '@products/products.module';
import { DataSource } from 'typeorm';
import { HttpRequestDispatcher } from '../products/business/request-dispatcher';
import { HttpRequestDispatcherFetch } from '../products/business/request-dispatcher-fetch';
import { CustomersController } from './api/customers.controller';
import { CustomersService } from './business/customers.service';
import { CustomersServiceDefault } from './business/customers.service.default';
import { CustomerTypeOrm } from './persistence/typeorm/customer.typeorm';
import { CustomersRepositoryTypeOrm } from './persistence/typeorm/customers-repository-typeorm';
import { CustomerFavoritedProductTypeOrm } from './persistence/typeorm/favorited-product.typeorm';

@Module({
  imports: [ProductsModule],
  controllers: [CustomersController],
  providers: [
    {
      provide: CustomersRepository,
      inject: [DataSource, Logger],
      useFactory: (ds: DataSource, logger: Logger) =>
        new CustomersRepositoryTypeOrm(
          ds.getRepository(CustomerTypeOrm),
          ds.getRepository(CustomerFavoritedProductTypeOrm),
          logger,
        ),
    },
    {
      provide: HttpRequestDispatcher,
      useClass: HttpRequestDispatcherFetch,
    },
    {
      provide: CustomersService,
      inject: [CustomersRepository, ProductsService],
      useFactory: (
        repository: CustomersRepository,
        productsService: ProductsService,
      ) => new CustomersServiceDefault(repository, productsService),
    },
  ],
})
export class CustomersModule {}
