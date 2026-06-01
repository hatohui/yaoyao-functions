import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PeopleService } from './people.service';

@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(private people: PeopleService) {}

  @Get()
  @ApiOperation({ operationId: 'getPeople' })
  findAll() {
    return this.people.findAll();
  }
}
