import { RecordToInstanceTransformer } from '../../../common';
import { OrderDto } from '../dtos';
import { ProductMapper } from './productMapper';

export class OrderMapper {
  public constructor(private readonly productMapper: ProductMapper) {}

  public mapEntityToDto(entityRecord: Record<any, any>): OrderDto {
    const productsDto = entityRecord['products'].map((product: any) => this.productMapper.mapEntityToDto(product));

    entityRecord['products'] = productsDto;

    return RecordToInstanceTransformer.transform(entityRecord, OrderDto);
  }
}
