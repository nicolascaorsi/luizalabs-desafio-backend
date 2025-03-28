import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTestDataSourceOptions } from './test-datasource-options';

@Module({})
export class TestDatabaseModule {
  static forRoot(schema: string): DynamicModule {
    const typeOrm = TypeOrmModule.forRoot(getTestDataSourceOptions(schema));
    return {
      module: TestDatabaseModule,
      imports: [typeOrm],
    };
  }
}
