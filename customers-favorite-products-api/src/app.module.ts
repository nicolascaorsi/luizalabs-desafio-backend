import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.development.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
