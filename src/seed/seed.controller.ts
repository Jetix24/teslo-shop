import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

// Define el decorador Controller que recibe como argumento el prefijo de la ruta
@Controller('seed')
// Define la clase SeedController
export class SeedController {
  // Define el constructor que recibe
  constructor(private readonly seedService: SeedService) {}

  // Define el método executeSeed que recibe una petición GET y retorna el resultado de ejecutar el seed
  @Get()
  executeSeed() {
    return this.seedService.runSeed();
  }
}
