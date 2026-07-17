import { ApiProperty } from '@nestjs/swagger';

export class AdminAuthResponseDto {
  @ApiProperty() valid: boolean;
}

export class PinAuthResponseDto {
  @ApiProperty() valid: boolean;
  @ApiProperty({ nullable: true, type: String }) eventId: string | null;
}
