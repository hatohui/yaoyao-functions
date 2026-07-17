import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PublishEventDto {
  @ApiPropertyOptional({ example: "Tonight's dinner" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Preset menu assigned to the whole event' })
  @IsString()
  @IsOptional()
  presetMenuId?: string;
}
