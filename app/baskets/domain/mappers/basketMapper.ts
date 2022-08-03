import { RecordToInstanceTransformer } from '../../../common';
import { BasketDto } from '../dtos';
import { ProductMapper } from './productMapper';

export class BasketMapper {
  public constructor(private readonly productMapper: ProductMapper) {}

  public mapEntityToDto(entityRecord: Record<any, any>): BasketDto {
    const productDto = entityRecord['products'].map((product: any) => this.productMapper.mapEntityToDto(product));

    entityRecord['products'] = productDto;

    return RecordToInstanceTransformer.transform(entityRecord, BasketDto);
  }
}
