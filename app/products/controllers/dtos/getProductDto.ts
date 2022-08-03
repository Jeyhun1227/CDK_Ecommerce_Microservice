import { IsUUID } from 'class-validator';
import { ProductDto } from './productDto';

export class GetProductParamDto {
  @IsUUID('4')
  public readonly id: string;
}

export class GetProductResponseData {
  public constructor(public readonly product: ProductDto) {}
}
