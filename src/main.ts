import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(configuration().port_nest, () =>
    console.log(`Server started on port - ${configuration().port_nest}`),
  );
}
bootstrap();
