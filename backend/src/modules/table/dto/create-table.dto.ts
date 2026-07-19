import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiPropertyOptional({
    description:
      'Seat an existing physical slot into the event. Omit to mint a new slot.',
  })
  @IsString()
  @IsOptional()
  slotId?: string;

  @ApiPropertyOptional({
    example: 'Table 1',
    description: 'Name for a newly minted slot; ignored when slotId is given',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 8, default: 8 })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Create as a staged table for the next event',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isStaging?: boolean;
}
