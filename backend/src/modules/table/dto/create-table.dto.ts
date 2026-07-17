import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ example: 'Table 1' })
  @IsString()
  name: string;

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
