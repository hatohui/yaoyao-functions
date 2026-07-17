import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { EventModule } from '@modules/event/event.module';

@Module({
  imports: [EventModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
