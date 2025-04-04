import { defaultDataSourceOptions } from '@config/typeorm.data-source-options.config';
import { Module } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      registerAs('database', () => ({
        ...defaultDataSourceOptions,
        url: process.env.DATABASE_URL,
      })).asProvider(),
    ),
  ],
  providers: [],
})
export class DatabaseModule {}
