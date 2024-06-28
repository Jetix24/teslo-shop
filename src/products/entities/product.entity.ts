import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ApiProperty } from '@nestjs/swagger';
// AL hacer swagger en la entity permite observar la documentación de la entidad y un ejemplo
// Una Entity es una clase que se mapea a una tabla en la base de datos.
// Define la entidad Product y define las columnas y relaciones de la tabla products
@Entity({ name: 'products' })
export class Product {
  // Columna primaria
  // ApiProperty es un decorador que se utiliza para documentar las propiedades de una entidad.
  @ApiProperty({
    // Ejemplo de id
    example: '1ea0a693-c2d1-4eeb-8782-f4a619673fff',
    // Descripción de id
    description: 'Product id',
    // Define que id es único
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Define la columna title como un texto y única
  @ApiProperty({
    example: "Men's Turbine Long Sleeve Tee",
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  // Define la columna price como un número flotante
  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  // Define la columna description como un texto y opcional
  @ApiProperty({
    example:
      "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Men's Turbine Long Sleeve Tee features a subtle, water-based T logo on the left chest and our Tesla wordmark below the back collar. The lightweight material is double-dyed, creating a soft, casual style for ideal wear in any season. Made from 50% cotton and 50% polyester.",
    description: 'Product description',
    default: '',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  // Define la columna slug como un texto y única
  @ApiProperty({
    example: 'men_turbine_long_sleeve_tee',
    description: 'Product slug',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  // Define la columna stock como un número entero
  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  // Define la columna sizes como un array de textos
  @ApiProperty({
    example: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  // Define la columna gender
  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  // Define la columna tags como un array de textos
  @ApiProperty({
    example: ['Shirt', 'Tee'],
    description: 'Product tags',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // Define la relación de uno a muchos con la entidad Product
  @ApiProperty({
    example: ['http://image1.jpg', 'http://image3.jpg'],
    description: 'Product images',
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  // Define un método que se ejecuta antes de insertar un registro que verifica si el slug está vacío y lo reemplaza por el título
  @BeforeInsert()
  ckeckSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  // Define un método que se ejecuta antes de actualizar un registro que verifica si el slug está vacío y lo reemplaza por el título
  @BeforeUpdate()
  ckeckSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
