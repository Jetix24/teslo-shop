import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';

// Define el decorador Module que recibe un objeto de configuración
@Module({
  controllers: [SeedController],
  providers: [SeedService],
  // Importa el módulo ProductsModule
  imports: [ProductsModule],
})
export class SeedModule {}
