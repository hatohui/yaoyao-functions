import { IsNumber, IsBoolean, IsArray, ValidateNested, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

class PresetFoodDto {
  @IsString()
  variantId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreatePresetDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PresetFoodDto)
  @IsOptional()
  foods?: PresetFoodDto[];
}
