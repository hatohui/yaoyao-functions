import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  by?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;
}
