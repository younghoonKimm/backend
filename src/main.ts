import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import "reflect-metadata";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();
