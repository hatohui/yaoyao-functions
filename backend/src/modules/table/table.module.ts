import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { PeopleModule } from '@modules/people/people.module';
import { EventModule } from '@modules/event/event.module';

@Module({
  imports: [PeopleModule, EventModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
