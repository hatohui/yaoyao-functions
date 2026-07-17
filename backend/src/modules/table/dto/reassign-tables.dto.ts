import { IsArray, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReassignTablesDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[];

  @ApiPropertyOptional({
    nullable: true,
    description: 'Target event id, or null to move back to staging',
  })
  @IsString()
  @IsOptional()
  eventId?: string | null;
}
