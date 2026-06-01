import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { GetFoodsResponseDto } from './dto/food-response.dto';

@ApiTags('foods')
@Controller('foods')
export class FoodController {
  constructor(private food: FoodService) {}

  @Get()
  @ApiOperation({ operationId: 'getFoods' })
  @ApiQuery({ name: 'lang', required: false, type: String, example: 'en' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'category', required: false, type: String, example: 'all' })
  @ApiResponse({ status: 200, type: GetFoodsResponseDto })
  findAll(
    @Query('lang') lang = 'en',
    @Query('page') page = '1',
    @Query('count') count = '20',
    @Query('category') category = 'all',
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const countNum = Math.min(100, Math.max(1, parseInt(count, 10) || 20));
    return this.food.findAll(lang, pageNum, countNum, category);
  }

  @Post()
  @ApiOperation({ operationId: 'createFood' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateFoodDto) {
    return this.food.create(dto);
  }
}
