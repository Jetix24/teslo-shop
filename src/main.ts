import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  // Es la configuración de Swagger.
  const config = new DocumentBuilder()
    // Define el título, la descripción y la versión de la documentación.
    .setTitle('Teslo RESTful API')
    .setDescription('Teslo shop endpoints') // Descripción de la documentación
    .setVersion('1.0') // Versión de la documentación
    .build(); // Construye la documentación.
  // Crea la documentación de Swagger
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Inicia la aplicación en el puerto 3000.
  await app.listen(3000);
}
bootstrap();
