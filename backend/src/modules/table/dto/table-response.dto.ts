import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TableDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() capacity: number;
  @ApiProperty() seated: number;
  @ApiProperty() isStaging: boolean;
  @ApiProperty() no: number;
  @ApiPropertyOptional({ nullable: true, type: Number }) x: number | null;
  @ApiPropertyOptional({ nullable: true, type: Number }) y: number | null;
  @ApiPropertyOptional({ nullable: true, type: String })
  tableLeaderId: string | null;
  @ApiPropertyOptional({ nullable: true, type: String })
  eventId: string | null;
}

export class TableListDto {
  @ApiProperty({ type: [TableDto] }) tables: TableDto[];
  @ApiProperty() total: number;
}
