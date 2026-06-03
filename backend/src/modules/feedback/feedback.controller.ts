import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private feedback: FeedbackService) {}

  @Get()
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
