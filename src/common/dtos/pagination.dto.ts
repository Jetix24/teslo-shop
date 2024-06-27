import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

// Determina los valores de paginación
export class PaginationDto {
  // Define los valores de paginación como el limit que es opcional, positivo y un número
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  // Define el valor de limit como un número y lo vuelve opcional
  limit?: number;

  // Define los valores de paginación como el offset que es opcional, positivo y un número
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  // Define el valor de offset como un número y lo vuelve opcional
  offset?: number;
}
