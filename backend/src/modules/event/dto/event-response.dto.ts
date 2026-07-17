import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventDto {
  @ApiProperty() id: string;
  @ApiProperty() pin: string;
  @ApiPropertyOptional({ nullable: true, type: String }) name: string | null;
  @ApiProperty() isActive: boolean;
  @ApiPropertyOptional({ nullable: true, type: String })
  presetMenuId: string | null;
  @ApiProperty() createdAt: string;
}

export class EventStatsDto {
  @ApiProperty() tables: number;
  @ApiProperty() occupied: number;
  @ApiProperty() people: number;
  @ApiProperty() orders: number;
}

export class EventSummaryDto extends EventDto {
  @ApiProperty({ type: EventStatsDto }) stats: EventStatsDto;
}
