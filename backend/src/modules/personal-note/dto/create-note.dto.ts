import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty()
  @IsString()
  personId: string;

  @ApiProperty()
  @IsString()
  content: string;
}
