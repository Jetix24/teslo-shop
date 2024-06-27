import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service'; // Asegúrate de usar la ruta correcta
import { initialData } from './data/seed-data';

// Define el decorador Injectable para el servicio que sirve para inyectar dependencias al servicio
@Injectable()
export class SeedService {
  // Define el constructor que recibe el productsService
  constructor(private readonly productsService: ProductsService) {}

  // Define el método runSeed que retorna un mensaje
  async runSeed() {
    // Ejecuta el método insertNewProducts
    await this.insertNewProducts();
    return 'SEED EXECUTED SUCCESSFULLY!';
  }

  // Define el método insertNewProducts que retorna un booleano
  private async insertNewProducts() {
    // Elimina todos los productos
    await this.productsService.deleteAllProducts();
    // Obtiene los productos iniciales
    const produts = initialData.products;
    // Define un arreglo de promesas vacío
    const insertPromises = [];

    // Itera sobre los productos y crea un arreglo de promesas
    produts.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    // Espera a que todas las promesas se resuelvan
    await Promise.all(insertPromises);
    return true;
  }
}
