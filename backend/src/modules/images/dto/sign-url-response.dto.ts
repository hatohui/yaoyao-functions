import { ApiProperty } from '@nestjs/swagger';

export class SignUrlResponseDto {
  @ApiProperty() url: string;
  @ApiProperty() key: string;
}
