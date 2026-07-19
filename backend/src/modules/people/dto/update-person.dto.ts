import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePersonDto {
  @ApiPropertyOptional({ example: 'Amy' })
  @IsOptional()
  @IsString()
  name?: string;
}
