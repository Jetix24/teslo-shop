import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

// Define la entidad ProductImage y define las columnas y relaciones de la tabla product_images
@Entity({ name: 'product_images' })
export class ProductImage {
  // Define la columna id como un número generado automáticamente
  @PrimaryGeneratedColumn()
  id: number;
  // Define la columna url como un texto
  @Column('text')
  url: string;

  // Define la relación de muchos a uno con la entidad Product
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
