import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
// AL hacerlo en el dto se valida la información que se envía al servidor y se coloca en el body la estrucutra por medio de swagger
// DTO (Data Transfer Object) para crear un producto, determina la forma en que se envían los datos al servidor
// Define la clase CreateProductDto
export class CreateProductDto {
  // Define el valor de title como un string, opcional y con una longitud mín
  @ApiProperty({
    default: 'Women’s Powerwall Tee',
    description: 'Product title',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @IsString()
  title: string;

  // Define el valor de price como un número, opcional y positivo
  @ApiProperty({
    default: 0,
    description: 'Product price',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  // Define el valor de description como un string y opcional
  @ApiProperty({
    default:
      'Inspired by our popular home battery, the Tesla Powerwall Tee is made from 100% cotton and features the phrase ’Pure Energy’ under our signature logo in the back. Designed for fit, comfort and style, the exclusive tee promotes sustainable energy in any',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  // Define el valor de slug como un string y opcional
  @ApiProperty({
    default: 'women_powerwall_tee',
    description: 'Product slug',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  // Define el valor de stock como un número, opcional y positivo
  @ApiProperty({
    default: 10,
    description: 'Product stock',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  // Define el valor de brand como un string y opcional
  @ApiProperty({
    example: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  // Define el valor de gender como un string, opcional y con un valor específico
  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @IsIn(['men', 'women', 'kids', 'unisex'])
  gender: string;

  // Define el valor de tags como un array de strings y opcional
  @ApiProperty({
    example: ['Shirt', 'Tee'],
    description: 'Product tags',
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  // Define el valor de images como un array de strings
  @ApiProperty({
    example: ['http://image1.jpg', 'http://image3.jpg'],
    description: 'Product images',
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
