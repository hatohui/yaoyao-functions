import { IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  personId: string;

  @IsString()
  content: string;
}
