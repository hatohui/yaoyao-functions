import { ApiProperty } from '@nestjs/swagger';

export class FoodItemDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, type: String }) imageUrl: string | null;
  @ApiProperty({ nullable: true, type: String }) description: string | null;
  @ApiProperty({ nullable: true, type: String }) categoryId: string | null;
  @ApiProperty() isAvailable: boolean;
  @ApiProperty() isPopular: boolean;
  @ApiProperty({ nullable: true, type: String }) defaultVariantId: string | null;
  @ApiProperty({ nullable: true, type: Number }) price: number | null;
  @ApiProperty({ nullable: true, type: String }) currency: string | null;
}

export class GetFoodsResponseDto {
  @ApiProperty({ type: [FoodItemDto] }) foods: FoodItemDto[];
  @ApiProperty() page: number;
  @ApiProperty() count: number;
  @ApiProperty() total: number;
}

export class FoodVariantDto {
  @ApiProperty() id: string;
  @ApiProperty() label: string;
  @ApiProperty({ nullable: true, type: Number }) price: number | null;
  @ApiProperty() currency: string;
  @ApiProperty() isSeasonal: boolean;
  @ApiProperty() isAvailable: boolean;
}

export class FoodDetailDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, type: String }) imageUrl: string | null;
  @ApiProperty({ nullable: true, type: String }) description: string | null;
  @ApiProperty({ nullable: true, type: String }) categoryId: string | null;
  @ApiProperty() isAvailable: boolean;
  @ApiProperty({ type: [FoodVariantDto] }) variants: FoodVariantDto[];
}
