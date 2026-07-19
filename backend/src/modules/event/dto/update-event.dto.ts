import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiPropertyOptional({
    nullable: true,
    type: String,
    example: "Tonight's dinner",
    description: 'Event name, or null to clear it',
  })
  @IsString()
  @IsOptional()
  @MaxLength(120)
  name?: string | null;
}
