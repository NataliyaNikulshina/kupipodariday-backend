import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './configuration';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(configuration().port_nest, () =>
    console.log(`Server started on port - ${configuration().port_nest}`),
  );
}
bootstrap();
