import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPresetDto {
  @ApiPropertyOptional({
    nullable: true,
    description: 'Preset menu id, or null to clear',
  })
  @IsString()
  @IsOptional()
  presetMenuId?: string | null;
}
