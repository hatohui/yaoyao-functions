import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class VariantDto {
  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false, example: 'RM' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isSeasonal?: boolean;
}

export class CreateFoodDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty({ type: [VariantDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @IsOptional()
  variants?: VariantDto[];
}
