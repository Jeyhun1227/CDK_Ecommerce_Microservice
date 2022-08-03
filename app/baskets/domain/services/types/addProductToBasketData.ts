import { IsUUID, IsNumber, IsString } from 'class-validator';

export class AddProductToBasketData {
  @IsUUID('4')
  public readonly id: string;

  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;
}
