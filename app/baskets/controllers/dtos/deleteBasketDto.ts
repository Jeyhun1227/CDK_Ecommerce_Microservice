import { IsUUID } from 'class-validator';

export class DeleteBasketParamDto {
  @IsUUID('4')
  public readonly id: string;
}
