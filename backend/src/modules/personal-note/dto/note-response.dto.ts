import { ApiProperty } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() personId: string;
  @ApiProperty() content: string;
}
