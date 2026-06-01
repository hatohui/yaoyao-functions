import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TableService } from './table.service';
import { PeopleService } from '@modules/people/people.service';

@ApiTags('tables')
@Controller('tables')
export class TableController {
  constructor(private table: TableService, private people: PeopleService) {}

  @Get()
  @ApiOperation({ operationId: 'getTables' })
  findAll() {
    return this.table.findAll();
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getTableById' })
  findOne(@Param('id') id: string) {
    return this.table.findOne(id);
  }

  @Get(':id/people')
  @ApiOperation({ operationId: 'getTablePeople' })
  getPeopleInTable(@Param('id') id: string) {
    return this.people.findByTableId(id);
  }
}
