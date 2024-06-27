import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
// Una Entity es una clase que se mapea a una tabla en la base de datos.
// Define la entidad Product y define las columnas y relaciones de la tabla products
@Entity({ name: 'products' })
export class Product {
  // Columna primaria
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Define la columna title como un texto y única
  @Column('text', {
    unique: true,
  })
  title: string;

  // Define la columna price como un número flotante
  @Column('float', {
    default: 0,
  })
  price: number;

  // Define la columna description como un texto y opcional
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  // Define la columna slug como un texto y única
  @Column('text', {
    unique: true,
  })
  slug: string;

  // Define la columna stock como un número entero
  @Column('int', {
    default: 0,
  })
  stock: number;

  // Define la columna sizes como un array de textos
  @Column('text', {
    array: true,
  })
  sizes: string[];

  // Define la columna gender
  @Column('text')
  gender: string;

  // Define la columna tags como un array de textos
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // Define la relación de uno a muchos con la entidad Product
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
