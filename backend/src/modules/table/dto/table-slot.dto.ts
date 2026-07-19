import { IsString, IsOptional, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TableSlotDto {
  @ApiProperty() id: string;
  @ApiProperty() no: number;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true, type: Number }) x: number | null;
  @ApiPropertyOptional({ nullable: true, type: Number }) y: number | null;
  @ApiProperty() defaultCapacity: number;
  @ApiProperty() isActive: boolean;
}

export class CreateTableSlotDto {
  @ApiPropertyOptional({ example: 'Table 4' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Fixed number; auto-assigned when omitted' })
  @IsInt()
  @IsOptional()
  @Min(1)
  no?: number;

  @ApiPropertyOptional({ default: 4 })
  @IsInt()
  @IsOptional()
  @Min(1)
  defaultCapacity?: number;
}

export class BulkCreateTableSlotDto {
  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(200)
  count: number;

  @ApiPropertyOptional({ default: 4 })
  @IsInt()
  @IsOptional()
  @Min(1)
  defaultCapacity?: number;
}

export class UpdateTableSlotDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  no?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  defaultCapacity?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
