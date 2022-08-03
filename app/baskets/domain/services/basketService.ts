import { BasketDto, ProductDto } from '../dtos';
import { AddProductToBasketData, CreateBasketData } from './types';
import { LoggerService } from '../../../common';
import { BasketRepository } from '../repositories/basketRepository';
import { BasketNotFoundError, ProductNotFoundError } from '../errors';
import { CheckoutBasketEventPublisher } from '../events';

const ITEM_NOT_FOUND_INDEX = -1;

export class BasketService {
  public constructor(
    private readonly basketRepository: BasketRepository,
    private readonly checkoutBasketEventPublisher: CheckoutBasketEventPublisher,
    private readonly loggerService: LoggerService,
  ) {}

  public async createBasket(basketData: CreateBasketData): Promise<BasketDto> {
    this.loggerService.debug('Creating basket...');

    const basket = await this.basketRepository.createOne({
      email: basketData.email,
      products: [],
    });

    this.loggerService.info('Basket created.', { basketId: basket.id });

    return basket;
  }

  public async findBasket(basketId: string): Promise<BasketDto> {
    this.loggerService.debug('Finding basket...', { basketId });

    const basket = await this.basketRepository.findOne(basketId);

    if (!basket) {
      throw new BasketNotFoundError(basketId);
    }

    this.loggerService.info('Basket found.', { basketId });

    return basket;
  }

  public async findBasketProducts(basketId: string): Promise<ProductDto[]> {
    this.loggerService.debug('Finding basket products...', { basketId });

    const basket = await this.basketRepository.findOne(basketId);

    if (!basket) {
      throw new BasketNotFoundError(basketId);
    }

    const { products } = basket;

    this.loggerService.info('Basket products found.', { basketId, products });

    return products;
  }

  public async findBaskets(): Promise<BasketDto[]> {
    const baskets = await this.basketRepository.findMany();

    return baskets;
  }

  public async checkoutBasket(basketId: string): Promise<void> {
    this.loggerService.debug('Checking basket out...', { basketId });

    const basket = await this.basketRepository.findOne(basketId);

    if (!basket) {
      throw new BasketNotFoundError(basketId);
    }

    const productsDto = basket.products.map((product: ProductDto) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        amount: basket.products.filter((otherProduct) => otherProduct.id === product.id).length,
      };
    });

    const uniqueProductsDto = productsDto.reduce(
      (acc: { id: string; name: string; price: number; amount: number }[], product) =>
        acc.find((otherProduct) => otherProduct.id === product.id) ? [...acc] : [...acc, product],
      [],
    );

    await this.checkoutBasketEventPublisher.publish({
      email: basket.email,
      products: uniqueProductsDto,
    });

    await this.basketRepository.removeOne(basketId);

    this.loggerService.info('Basket checked out.', { basketId });
  }

  public async addProductToBasket(basketId: string, product: AddProductToBasketData): Promise<BasketDto> {
    this.loggerService.debug('Adding product to basket...', { basketId, product });

    const basket = await this.basketRepository.findOne(basketId);

    if (!basket) {
      throw new BasketNotFoundError(basketId);
    }

    const updatedProducts = [...basket.products, { ...product }];

    const updatedBasket = await this.basketRepository.updateOne(basketId, { products: updatedProducts });

    this.loggerService.info('Product added to basket.', { basketId, product });

    return updatedBasket;
  }

  public async removeProductFromBasket(basketId: string, productId: string): Promise<BasketDto> {
    this.loggerService.debug('Removing product from basket...', { basketId, productId });

    const basket = await this.basketRepository.findOne(basketId);

    if (!basket) {
      throw new BasketNotFoundError(basketId);
    }

    const updatedProducts = basket.products;

    const indexOfProductToRemove = updatedProducts.findIndex(
      (value: { readonly id: string; readonly name: string; readonly price: number }) => value.id === productId,
    );

    if (indexOfProductToRemove === ITEM_NOT_FOUND_INDEX) {
      throw new ProductNotFoundError(productId);
    }

    updatedProducts.splice(indexOfProductToRemove, 1);

    const updatedBasket = await this.basketRepository.updateOne(basketId, { products: updatedProducts });

    this.loggerService.info('Product removed from basket.', { basketId, productId });

    return updatedBasket;
  }

  public async removeBasket(basketId: string): Promise<void> {
    this.loggerService.debug('Removing basket...', { basketId });

    await this.basketRepository.removeOne(basketId);

    this.loggerService.info('Basket removed.', { basketId });
  }
}
