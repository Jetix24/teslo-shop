import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service'; // Asegúrate de usar la ruta correcta
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'SEED EXECUTED SUCCESSFULLY!';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
    const produts = initialData.products;

    const insertPromises = [];

    produts.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
