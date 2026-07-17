import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({ example: 'Amy' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Table to seat this person at' })
  @IsString()
  tableId: string;
}
