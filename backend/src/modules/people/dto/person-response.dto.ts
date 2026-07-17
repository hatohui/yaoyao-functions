import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PersonDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true, type: String })
  tableId: string | null;
  @ApiPropertyOptional({ nullable: true, type: String })
  eventId: string | null;
}
