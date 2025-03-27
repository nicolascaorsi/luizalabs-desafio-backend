import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CustomerTypeOrm } from "../features/customers/persistence/typeorm/customer.typeorm";

export default registerAs('database', (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [CustomerTypeOrm],
    // synchronize: true,
    // dropSchema: true,
    logging: process.env.TYPEORM_LOGGING == 'true',
}));