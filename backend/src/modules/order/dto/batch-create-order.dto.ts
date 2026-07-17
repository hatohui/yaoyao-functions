import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BatchOrderItemDto {
  @ApiProperty()
  @IsString()
  variantId: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  quantity?: number;
}

export class BatchCreateOrderDto {
  @ApiProperty()
  @IsString()
  tableId: string;

  @ApiProperty({ type: [BatchOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BatchOrderItemDto)
  items: BatchOrderItemDto[];

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  splitAll?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  personIds?: string[];
}
