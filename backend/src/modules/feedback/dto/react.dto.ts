import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactDto {
  @ApiProperty({ example: '👍', description: 'Any emoji' })
  @IsString()
  @MinLength(1)
  @MaxLength(16)
  emoji: string;
}
