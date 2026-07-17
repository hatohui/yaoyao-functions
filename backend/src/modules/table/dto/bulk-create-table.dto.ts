import { IsInt, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkCreateTableDto {
  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(100)
  count: number;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isStaging?: boolean;
}
