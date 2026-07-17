import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventService } from './event.service';
import { PublishEventDto } from './dto/publish-event.dto';
import { AssignPresetDto } from './dto/assign-preset.dto';
import {
  EventDto,
  EventSummaryDto,
} from './dto/event-response.dto';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('events')
@Controller('events')
@UseGuards(AdminGuard)
export class EventController {
  constructor(private events: EventService) {}

  @Get('active')
  @ApiOperation({ operationId: 'getActiveEvent' })
  @ApiResponse({ status: 200, type: EventSummaryDto })
  getActive() {
    return this.events.getActiveWithStats();
  }

  @Get()
  @ApiOperation({ operationId: 'getPastEvents' })
  @ApiResponse({ status: 200, type: [EventSummaryDto] })
  findPast() {
    return this.events.findPast();
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getEventById' })
  @ApiResponse({ status: 200, type: EventSummaryDto })
  findOne(@Param('id') id: string) {
    return this.events.findOne(id);
  }

  @Post('publish')
  @ApiOperation({ operationId: 'publishEvent' })
  @ApiResponse({ status: 201, type: EventDto })
  publish(@Body() dto: PublishEventDto) {
    return this.events.publish(dto);
  }

  @Patch(':id/preset')
  @ApiOperation({ operationId: 'assignEventPreset' })
  @ApiResponse({ status: 200, type: EventDto })
  assignPreset(@Param('id') id: string, @Body() dto: AssignPresetDto) {
    return this.events.assignPreset(id, dto.presetMenuId ?? null);
  }
}
