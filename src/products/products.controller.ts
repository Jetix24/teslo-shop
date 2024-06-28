import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Product } from './entities';

// Controlador que maneja las peticiones relacionadas con los productos. pone como base el endpoint /products
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Define el método create que recibe un createProductDto y llama al método create del servicio
  @Post()
  // Define las respuestas de la petición
  @ApiResponse({ status: 201, description: 'Product created', type: Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Frobideen. TOken related' })
  // Determina con el Body que el método recibe un cuerpo en la petición y se valida con el CreateProductDto
  // El body es para enviar datos en el cuerpo de la petición
  create(@Body() createProductDto: CreateProductDto) {
    // Llama al método create del servicio y le pasa el createProductDto
    return this.productsService.create(createProductDto);
  }

  // Define el método findAll que recibe un paginationDto y llama al método findAll del servicio
  @Get()
  // Determina con el Query que el método recibe un query en la petición y se valida con el PaginationDto
  // El query es para enviar datos en la url y se usa para filtrar o paginar recursos
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto);
    // Llama al método findAll del servicio y le pasa el paginationDto por lo que va a mostrar los productos limitados por la paginación
    return this.productsService.findAll(paginationDto);
  }

  // Define el método findOne que recibe un id y llama al método findOne del servicio
  @Get(':term')
  // Determina con el Param que el método recibe un parámetro en la petición
  // Params se usan para identificar un recurso específico
  findOne(@Param('term') term: string) {
    // Llama al método findOne del servicio y le pasa el term, ya sea el id, el slug o el title
    return this.productsService.findOnePlain(term);
  }

  // Define el método update que recibe un id y llama al método findOne del servicio
  @Patch(':id')
  update(
    // Determina con el Param que el método recibe un parámetro en la petición y se valida con el ParseUUIDPipe
    @Param('id', ParseUUIDPipe) id: string,
    // Determina con el Body que el método recibe un cuerpo en la petición y se valida con el UpdateProductDto
    @Body() updateProductDto: UpdateProductDto,
  ) {
    // Llama al método update del servicio y le pasa el id y el updateProductDto
    return this.productsService.update(id, updateProductDto);
  }

  // Define el método remove que recibe un id y llama al método remove del servicio
  @Delete(':id')
  // Determina con el Param que el método recibe el id en la petición y se valida con el ParseUUIDPipe
  remove(@Param('id', ParseUUIDPipe) id: string) {
    // Llama al método remove del servicio y le pasa el id
    return this.productsService.remove(id);
  }
}
