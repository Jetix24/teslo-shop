import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';

// Define el decorador Injectable para el servicio que sirve para inyectar dependencias al servicio
@Injectable()
export class ProductsService {
  // Define un atributo privado llamado logger de tipo Logger que se usa para hacer logs y un log es un mensaje que se guarda en un archivo
  private readonly logger = new Logger('ProductsService');

  // Define el constructor que recibe el productRepository, el productImageRepository y el dataSource
  constructor(
    // Inyecta el repositorio de Product osea la entidad Product
    // Define un atributo privado llamado productRepository de tipo Repository que se usa para hacer operaciones con la base de datos
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // Inyecta el repositorio de ProductImage osea la entidad ProductImage
    // Define un atributo privado llamado productImageRepository de tipo Repository que se usa para hacer operaciones con la base de datos
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // Inyecta el dataSource que es la conexión a la base de datos
    private readonly dataSource: DataSource,
  ) {}

  // Define el método create que recibe un createProductDto y retorna el producto creado
  async create(createProductDto: CreateProductDto) {
    // Define un objeto productDetails que es igual a createProductDto y si no tiene un atributo images se le asigna un arreglo vacío
    try {
      // Crea un producto con el createProductDto y lo desconstruye en images y productDetails
      const { images = [], ...productDetails } = createProductDto;
      // Crea un producto con el productDetails y le asigna las imágenes
      const product = this.productRepository.create({
        // Crea un producto con el productDetails y le asigna las imágenes
        ...productDetails,
        // Mapea las imágenes y crea un objeto con la url de la imagen
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      // Guarda el producto en la base de datos
      await this.productRepository.save(product);
      // Retorna el producto junto con las imágenes
      return { ...product, images };
      // Maneja las excepciones de la base de datos
    } catch (error) {
      // Si el error es 23505 lanza una excepción BadRequestException con el detalle del error
      this.handleDBExceptions(error);
    }
  }

  // Define el método findAll que recibe un paginationDto y retorna los productos
  async findAll(paginationDto: PaginationDto) {
    // Define un objeto paginationDto que tiene un límite de 10 y un offset de 0 por default si no se le pasa un objeto
    const { limit = 10, offset = 0 } = paginationDto;

    // Busca los productos con el límite y el offset y las imágenes
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true },
    });

    // Retorna los productos con las imágenes
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((image) => image.url),
    }));
  }

  // Define el método findOne que recibe un term y retorna el producto
  async findOne(term: string) {
    // Define un producto que es igual a buscar un producto por el id o por el título o el slug
    let product: Product;

    // Si el term es un UUID busca el producto por el id
    if (isUUID(term)) {
      // Busca el producto por el id
      product = await this.productRepository.findOneBy({ id: term });
      // Si el term no es un UUID busca el producto por el título o el slug
    } else {
      // Crea un queryBuilder con el productRepository y lo asigna a queryBuilder
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      // Busca el producto por el título o el slug
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug=:slug`, {
          // Convierte el term a mayúsculas y minúsculas
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        // Hace un left join con las imágenes
        .leftJoinAndSelect('prod.images', 'prodImages')
        // Obtiene solo un producto
        .getOne();
    }

    // Si no encuentra el producto lanza una excepción BadRequestException con el mensaje de que no se encontró el producto
    if (!product) {
      throw new BadRequestException(`Produdct with ${term} not found`);
    }

    // Retorna el producto
    return product;
  }

  // Define el método findOnePlain que recibe un term y retorna el producto
  async findOnePlain(term: string) {
    // Define un objeto que tiene un atributo images que es un arreglo vacío y el resto de los atributos del producto
    const { images = [], ...rest } = await this.findOne(term);
    // Retorna el producto con las imágenes
    return {
      // Retorna el producto con las imágenes
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  // Define el método update que recibe un id y un updateProductDto y retorna el producto actualizado
  async update(id: string, updateProductDto: UpdateProductDto) {
    // Desconstruye el updateProductDto en images y toUpdate
    const { images, ...toUpdate } = updateProductDto;
    // Busca el producto por el id y lo asigna a product
    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
    });

    // Si no encuentra el producto lanza una excepción NotFoundException con el mensaje de que no se encontró el producto
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    //Create query runner
    // Define un queryRunner que es igual a crear un queryRunner con el dataSource osea puede hacer queries a la base de datos
    const queryRunner = this.dataSource.createQueryRunner();
    // Conecta el queryRunner a la base de datos
    await queryRunner.connect();
    // Inicia una transacción
    await queryRunner.startTransaction();

    // Try to update the product
    try {
      // Si hay imágenes borra las imágenes del producto y le asigna las nuevas imágenes
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      // Guarda el producto en la base de datos
      await queryRunner.manager.save(product);
      // Hace commit de la transacción
      await queryRunner.commitTransaction();
      // Libera el queryRunner
      await queryRunner.release();
      // Retorna el producto
      return this.findOnePlain(id);
      // Maneja las excepciones de la base de datos
    } catch (error) {
      // Hace rollback de la transacción
      await queryRunner.rollbackTransaction();
      // Libera el queryRunner
      await queryRunner.release();
      // Si el error es 23505 lanza una excepción BadRequestException con el detalle del error
      this.handleDBExceptions(error);
    }
  }

  // Define el método remove que recibe un id y retorna el producto eliminado
  async remove(id: string) {
    // Busca el producto por el id y lo asigna a product
    const product = await this.findOne(id);
    // Elimina el producto de la base de datos
    await this.productRepository.remove(product);
    // Retorna el producto
    return product;
  }

  // Define el método handleDBExceptions que recibe un error y maneja las excepciones de la base de datos
  private handleDBExceptions(error: any) {
    // Si el error es 23505 lanza una excepción BadRequestException con el detalle del error
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    // Hace un log del error
    this.logger.error(error);
    // Lanza una excepción InternalServerErrorException con el mensaje de que hubo un error inesperado creando un producto
    throw new InternalServerErrorException(
      'Unexpected error creating a product',
    );
  }

  // Define el método deleteAllProducts que elimina todos los productos
  async deleteAllProducts() {
    // Crea un query con el productRepository, lo crea antes del try catch para poder manejar las excepciones
    const query = this.productRepository.createQueryBuilder('prod');

    // Try to delete all products
    try {
      // Elimina todos los productos
      return await query.delete().where({}).execute();
    } catch (error) {
      // Maneja las excepciones de la base de datos
      this.handleDBExceptions(error);
    }
  }
}
