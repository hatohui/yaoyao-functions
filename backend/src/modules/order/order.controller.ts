import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private order: OrderService) {}

  @Get()
  @ApiOperation({ operationId: 'getOrders' })
  @ApiQuery({ name: 'tableId', required: false, type: String })
  findAll(@Query('tableId') tableId?: string) {
    if (tableId) return this.order.findByTable(tableId);
    return this.order.findAll();
  }

  @Post()
  @ApiOperation({ operationId: 'createOrder' })
  create(@Body() dto: CreateOrderDto) {
    return this.order.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteOrder' })
  remove(@Param('id') id: string) {
    return this.order.remove(id);
  }
}
