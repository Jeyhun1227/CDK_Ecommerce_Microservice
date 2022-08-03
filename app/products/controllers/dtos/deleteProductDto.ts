import { IsUUID } from 'class-validator';

export class DeleteProductParamDto {
  @IsUUID('4')
  public readonly id: string;
}
