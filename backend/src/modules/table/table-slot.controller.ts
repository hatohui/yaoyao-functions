import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TableSlotService } from './table-slot.service';
import { AdminGuard } from '@common/guards/admin.guard';
import { TablePositionDto } from './dto/table-position.dto';
import {
  TableSlotDto,
  CreateTableSlotDto,
  BulkCreateTableSlotDto,
  UpdateTableSlotDto,
} from './dto/table-slot.dto';

@ApiTags('table-slots')
@Controller('table-slots')
export class TableSlotController {
  constructor(private slots: TableSlotService) {}

  @Get()
  @ApiOperation({ operationId: 'getTableSlots' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [TableSlotDto] })
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.slots.findAll(includeInactive === 'true');
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getTableSlotById' })
  @ApiResponse({ status: 200, type: TableSlotDto })
  findOne(@Param('id') id: string) {
    return this.slots.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'createTableSlot' })
  @ApiResponse({ status: 201, type: TableSlotDto })
  create(@Body() dto: CreateTableSlotDto) {
    return this.slots.create(dto);
  }

  @Post('bulk')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'bulkCreateTableSlots' })
  bulkCreate(@Body() dto: BulkCreateTableSlotDto) {
    return this.slots.bulkCreate(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'updateTableSlot' })
  @ApiResponse({ status: 200, type: TableSlotDto })
  update(@Param('id') id: string, @Body() dto: UpdateTableSlotDto) {
    return this.slots.update(id, dto);
  }

  @Patch(':id/position')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'updateTableSlotPosition' })
  @ApiResponse({ status: 200, type: TableSlotDto })
  updatePosition(@Param('id') id: string, @Body() dto: TablePositionDto) {
    return this.slots.updatePosition(id, dto.x, dto.y);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: 'deleteTableSlot' })
  remove(@Param('id') id: string) {
    return this.slots.remove(id);
  }
}
