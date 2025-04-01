import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  setupSwagger(app);
  const port = Number(app.get(ConfigService).get('PORT'));
  await app.listen(port);
}
void bootstrap();

function setupSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('API de produtos favoritos')
    .setDescription(
      'API que disponibiliza o recurso de produtos favoritos de clientes',
    )
    .setVersion('1.0')
    .addBearerAuth(undefined, 'JWT')
    .addGlobalResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Quando ocorre um erro inesperado ao processar a requisição',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}
