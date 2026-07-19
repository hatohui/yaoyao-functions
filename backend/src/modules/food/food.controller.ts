import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { AddFoodVariantDto } from './dto/add-food-variant.dto';
import { UpdateFoodVariantDto } from './dto/update-food-variant.dto';
import {
  GetFoodsResponseDto,
  GetFoodsForAdminResponseDto,
  FoodDetailDto,
} from './dto/food-response.dto';
import { AdminGuard } from '@common/guards/admin.guard';
import { BulkToggleDto } from '@common/dto/bulk-toggle.dto';
import { IdsDto } from '@common/dto/ids.dto';

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

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'getFoodsForAdmin' })
  @ApiQuery({ name: 'lang', required: false, type: String, example: 'en' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'category', required: false, type: String, example: 'all' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, type: GetFoodsForAdminResponseDto })
  findAllForAdmin(
    @Query('lang') lang = 'en',
    @Query('page') page = '1',
    @Query('count') count = '20',
    @Query('category') category = 'all',
    @Query('search') search?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const countNum = Math.min(100, Math.max(1, parseInt(count, 10) || 20));
    return this.food.findAllForAdmin(lang, pageNum, countNum, category, search);
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getFoodById' })
  @ApiQuery({ name: 'lang', required: false, type: String, example: 'en' })
  @ApiResponse({ status: 200, type: FoodDetailDto })
  findOne(@Param('id') id: string, @Query('lang') lang = 'en') {
    return this.food.findOne(id, lang);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'createFood' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateFoodDto) {
    return this.food.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'updateFood' })
  update(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
    return this.food.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'deleteFood' })
  remove(@Param('id') id: string) {
    return this.food.remove(id);
  }

  @Post('bulk-toggle')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'bulkToggleFoods' })
  bulkToggle(@Body() dto: BulkToggleDto) {
    return this.food.bulkToggle(dto.ids, dto.isAvailable);
  }

  @Post('bulk-delete')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'bulkDeleteFoods' })
  bulkDelete(@Body() dto: IdsDto) {
    return this.food.bulkRemove(dto.ids);
  }

  @Post(':id/variants')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'addFoodVariant' })
  addVariant(@Param('id') id: string, @Body() dto: AddFoodVariantDto) {
    return this.food.addVariant(id, dto);
  }

  @Patch('variants/:variantId')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'updateFoodVariant' })
  updateVariant(
    @Param('variantId') variantId: string,
    @Body() dto: UpdateFoodVariantDto,
  ) {
    return this.food.updateVariant(variantId, dto);
  }

  @Delete('variants/:variantId')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'deleteFoodVariant' })
  removeVariant(@Param('variantId') variantId: string) {
    return this.food.removeVariant(variantId);
  }
}
