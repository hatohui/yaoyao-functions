import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PopularItemDto {
  @ApiProperty() variantId: string;
  @ApiProperty() name: string;
  @ApiProperty() count: number;
}

export class TableTotalDto {
  @ApiProperty() no: number;
  @ApiProperty() tableId: string;
  @ApiProperty() name: string;
  @ApiProperty() total: number;
  @ApiProperty() isOutlier: boolean;
}

export class PersonRowDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true, type: String })
  tableName: string | null;
  @ApiPropertyOptional({ nullable: true, type: String })
  tableId: string | null;
  @ApiProperty({ type: [String] }) ordered: string[];
  @ApiPropertyOptional({ nullable: true, type: String }) note: string | null;
}

export class PeopleListDto {
  @ApiProperty({ type: [PersonRowDto] }) people: PersonRowDto[];
  @ApiProperty() total: number;
}
