import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.development.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
