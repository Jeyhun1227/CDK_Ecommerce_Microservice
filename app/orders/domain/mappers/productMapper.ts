import { RecordToInstanceTransformer } from '../../../common';
import { ProductDto } from '../dtos';

export class ProductMapper {
  public mapEntityToDto(entityRecord: Record<any, any>): ProductDto {
    return RecordToInstanceTransformer.transform(entityRecord, ProductDto);
  }
}
