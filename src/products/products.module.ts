import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities/index';

//El modulo ProductsModule importa TypeOrmModule y lo usa para importar las entidades Product y ProductImage.
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  // Exporta los modulos y servicios que se van a usar en otros modulos
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
