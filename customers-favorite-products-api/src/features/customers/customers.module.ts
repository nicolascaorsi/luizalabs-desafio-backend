import { Logger } from '@config/logger';
import { CustomersRepository } from '@customers/persistence/customers-repository';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CustomersController } from './api/customers.controller';
import { CustomersService } from './business/customers.service';
import { CustomersServiceDefault } from './business/customers.service.default';
import { CustomerTypeOrm } from './persistence/typeorm/customer.typeorm';
import { CustomersRepositoryTypeOrm } from './persistence/typeorm/customers-repository-typeorm';

@Module({
  controllers: [CustomersController],
  providers: [
    {
      provide: CustomersRepository,
      inject: [DataSource, Logger],
      useFactory: (ds: DataSource, logger: Logger) =>
        new CustomersRepositoryTypeOrm(
          ds.getRepository(CustomerTypeOrm),
          logger,
        ),
    },
    {
      provide: CustomersService,
      inject: [CustomersRepository],
      useFactory: (repository: CustomersRepository) =>
        new CustomersServiceDefault(repository),
    },
  ],
})
export class CustomersModule {}
