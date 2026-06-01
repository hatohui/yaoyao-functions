import { ApiProperty } from '@nestjs/swagger';

export class FoodItemDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, type: String }) imageUrl: string | null;
  @ApiProperty({ nullable: true, type: String }) description: string | null;
  @ApiProperty({ nullable: true, type: String }) categoryId: string | null;
  @ApiProperty() isAvailable: boolean;
}

export class GetFoodsResponseDto {
  @ApiProperty({ type: [FoodItemDto] }) foods: FoodItemDto[];
  @ApiProperty() page: number;
  @ApiProperty() count: number;
  @ApiProperty() total: number;
}
