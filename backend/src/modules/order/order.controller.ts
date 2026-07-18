import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BatchCreateOrderDto } from './dto/batch-create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private order: OrderService) {}

  @Get()
  @ApiOperation({ operationId: 'getOrders' })
  @ApiQuery({ name: 'tableId', required: false, type: String })
  @ApiQuery({ name: 'lang', required: false, type: String, example: 'en' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  findAll(@Query('tableId') tableId?: string, @Query('lang') lang = 'en') {
    if (tableId) return this.order.findByTable(tableId, lang);
    return this.order.findAll(lang);
  }

  @Post()
  @ApiOperation({ operationId: 'createOrder' })
  @ApiQuery({ name: 'lang', required: false, type: String, example: 'en' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  create(@Body() dto: CreateOrderDto, @Query('lang') lang = 'en') {
    return this.order.create(dto, lang);
  }

  @Post('batch')
  @ApiOperation({ operationId: 'createOrderBatch' })
  @ApiQuery({ name: 'lang', required: false, type: String, example: 'en' })
  @ApiResponse({ status: 201, type: [OrderResponseDto] })
  createBatch(@Body() dto: BatchCreateOrderDto, @Query('lang') lang = 'en') {
    return this.order.createBatch(dto, lang);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateOrder' })
  @ApiQuery({ name: 'lang', required: false, type: String, example: 'en' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @Query('lang') lang = 'en',
  ) {
    return this.order.update(id, dto, lang);
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteOrder' })
  remove(@Param('id') id: string) {
    return this.order.remove(id);
  }
}
