import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableSlotController } from './table-slot.controller';
import { TableSlotService } from './table-slot.service';
import { PeopleModule } from '@modules/people/people.module';
import { EventModule } from '@modules/event/event.module';
import { ConfigModule } from '@modules/config/config.module';

@Module({
  imports: [PeopleModule, EventModule, ConfigModule],
  controllers: [TableController, TableSlotController],
  providers: [TableService, TableSlotService],
  exports: [TableService, TableSlotService],
})
export class TableModule {}
