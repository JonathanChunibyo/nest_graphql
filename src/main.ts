// Factory
import { NestFactory } from '@nestjs/core';
// Module
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3777);
}
bootstrap();
