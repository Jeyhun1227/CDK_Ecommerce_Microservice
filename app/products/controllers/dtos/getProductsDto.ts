import { ProductDto } from './productDto';

export class GetProductsResponseData {
  public constructor(public readonly products: ProductDto[]) {}
}
