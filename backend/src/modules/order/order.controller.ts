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
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BatchCreateOrderDto } from './dto/batch-create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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

  @Post('batch')
  @ApiOperation({ operationId: 'createOrderBatch' })
  createBatch(@Body() dto: BatchCreateOrderDto) {
    return this.order.createBatch(dto);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateOrder' })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.order.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteOrder' })
  remove(@Param('id') id: string) {
    return this.order.remove(id);
  }
}
