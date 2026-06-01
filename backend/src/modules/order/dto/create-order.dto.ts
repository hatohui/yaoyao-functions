import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  tableId: string;

  @IsString()
  variantId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  orderedBy?: string;
}
