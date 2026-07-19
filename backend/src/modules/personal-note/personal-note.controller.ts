import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PersonalNoteService } from './personal-note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteResponseDto } from './dto/note-response.dto';

@ApiTags('personal-notes')
@Controller('personal-notes')
export class PersonalNoteController {
  constructor(private notes: PersonalNoteService) {}

  @Get()
  @ApiOperation({ operationId: 'getNotesByPerson' })
  @ApiQuery({ name: 'personId', required: true, type: String })
  @ApiResponse({ status: 200, type: [NoteResponseDto] })
  findByPerson(@Query('personId') personId: string) {
    return this.notes.findByPerson(personId);
  }

  @Post()
  @ApiOperation({ operationId: 'createNote' })
  @ApiResponse({ status: 201, type: NoteResponseDto })
  create(@Body() dto: CreateNoteDto) {
    return this.notes.create(dto);
  }

  @Put()
  @ApiOperation({ operationId: 'upsertNote' })
  @ApiResponse({ status: 200, type: NoteResponseDto })
  upsert(@Body() dto: CreateNoteDto) {
    return this.notes.upsert(dto);
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteNote' })
  remove(@Param('id') id: string) {
    return this.notes.remove(id);
  }
}
