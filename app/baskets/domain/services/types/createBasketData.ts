import { IsString } from 'class-validator';

export class CreateBasketData {
  @IsString()
  public readonly email: string;
}
