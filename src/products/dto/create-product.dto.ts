import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
// DTO (Data Transfer Object) para crear un producto, determina la forma en que se envían los datos al servidor
// Define la clase CreateProductDto
export class CreateProductDto {
  // Define el valor de title como un string, opcional y con una longitud mín
  @IsString()
  @MinLength(1)
  @IsString()
  @IsOptional()
  title: string;

  // Define el valor de price como un número, opcional y positivo
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  // Define el valor de description como un string y opcional
  @IsString()
  @IsOptional()
  description?: string;

  // Define el valor de slug como un string y opcional
  @IsString()
  @IsOptional()
  slug?: string;

  // Define el valor de stock como un número, opcional y positivo
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  // Define el valor de brand como un string y opcional
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  // Define el valor de gender como un string, opcional y con un valor específico
  @IsIn(['men', 'women', 'kids', 'unisex'])
  gender: string;

  // Define el valor de tags como un array de strings y opcional
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  // Define el valor de images como un array de strings
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
