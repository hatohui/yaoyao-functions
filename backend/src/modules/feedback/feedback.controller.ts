import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private feedback: FeedbackService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'getFeedback' })
  findAll() {
    return this.feedback.findAll();
  }

  @Post()
  @ApiOperation({ operationId: 'createFeedback' })
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedback.create(dto);
  }
}
