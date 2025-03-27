import { DataSource, DataSourceOptions } from 'typeorm';
import { CustomerTypeOrm } from '../../customer.typeorm';

export class IntegrationTestDataSource extends DataSource {
    constructor(private readonly schema: string, url: string) {
        const options: DataSourceOptions = {
            type: 'postgres',
            url,
            schema,
            entities: [CustomerTypeOrm],
            // logging: true,
        };
        super(options);
    }

    async initialize(): Promise<this> {
        await super.initialize();
        await this.query(`DROP SCHEMA IF EXISTS ${this.schema} CASCADE`)
        await this.query(`CREATE SCHEMA ${this.schema}`)
        return this;
    }

    async destroy(): Promise<void> {
        await this.query(`DROP SCHEMA ${this.schema} CASCADE`)
        return super.destroy();
    }
}
