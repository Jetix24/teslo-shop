import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse } from '@nestjs/swagger';
import { Seed } from './entities/seed.entity';

// Define el decorador Controller que recibe como argumento el prefijo de la ruta
@Controller('seed')
// Define la clase SeedController
export class SeedController {
  // Define el constructor que recibe
  constructor(private readonly seedService: SeedService) {}

  // Define el método executeSeed que recibe una petición GET y retorna el resultado de ejecutar el seed
  @Get()
  @ApiResponse({ status: 201, description: 'Seed created', type: Seed })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
