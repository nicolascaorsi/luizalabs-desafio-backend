import { ConsoleLogger } from '@config/console-logger';
import { Logger } from '@config/logger';
import { CustomersModule } from '@customers/customers.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from '@products/products.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';

const LOGGER_PROVIDER = {
  provide: Logger,
  useClass: ConsoleLogger,
};
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.development.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
    }),
    DatabaseModule,
    ProductsModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [LOGGER_PROVIDER],
  exports: [LOGGER_PROVIDER],
})
export class AppModule {}
