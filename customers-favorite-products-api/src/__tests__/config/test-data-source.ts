import { DataSource } from 'typeorm';
import { getTestDataSourceOptions } from './test-datasource-options';

export class TestDataSource extends DataSource {
  constructor(public readonly schema: string) {
    super(getTestDataSourceOptions(schema));
  }

  async initialize(): Promise<this> {
    await super.initialize();
    await this.query(`DROP SCHEMA IF EXISTS ${this.schema} CASCADE`);
    await this.query(`CREATE SCHEMA ${this.schema}`);
    return this;
  }

  async destroy(): Promise<void> {
    await this.query(`DROP SCHEMA ${this.schema} CASCADE`);
    return super.destroy();
  }
}
