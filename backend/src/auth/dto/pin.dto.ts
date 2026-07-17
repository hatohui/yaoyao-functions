import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PinDto {
  @ApiProperty({ example: '4821' })
  @IsString()
  pin: string;
}
