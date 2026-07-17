import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TablePositionDto {
  @ApiProperty({ example: 120.5 })
  @IsNumber()
  x: number;

  @ApiProperty({ example: 80 })
  @IsNumber()
  y: number;
}
