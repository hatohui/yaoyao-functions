import { ApiProperty } from '@nestjs/swagger';

export class OrderSplitDto {
  @ApiProperty() personId: string;
}

export class OrderResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() tableId: string;
  @ApiProperty() variantId: string;
  @ApiProperty({ nullable: true, type: String }) eventId: string | null;
  @ApiProperty() quantity: number;
  @ApiProperty() price: number;
  @ApiProperty() splitAll: boolean;
  @ApiProperty() foodName: string;
  @ApiProperty() variantLabel: string;
  @ApiProperty({ type: [OrderSplitDto] }) splits: OrderSplitDto[];
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
