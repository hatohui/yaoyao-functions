import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ example: 'yaoyao' })
  @IsString()
  passphrase: string;
}
