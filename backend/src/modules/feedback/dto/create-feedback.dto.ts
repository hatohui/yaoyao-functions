import { IsString, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsOptional()
  by?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
