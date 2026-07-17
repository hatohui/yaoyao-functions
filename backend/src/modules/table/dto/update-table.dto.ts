import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTableDto {
  @ApiPropertyOptional({ example: 'VIP Table' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}
