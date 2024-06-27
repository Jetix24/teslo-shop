import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Es el método principal de la aplicación. Es el punto de entrada de la aplicación.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Add the following line to the bootstrap() function in src/main.ts:
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    // Permite que los datos que no cumplan con las reglas definidas en los DTOs no se envíen al controlador.
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Inicia la aplicación en el puerto 3000.
  await app.listen(3000);
}
bootstrap();
