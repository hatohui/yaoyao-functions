import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddPresetItemDto {
  @ApiProperty()
  @IsString()
  variantId: string;

  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;
}

export class UpdatePresetItemDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
