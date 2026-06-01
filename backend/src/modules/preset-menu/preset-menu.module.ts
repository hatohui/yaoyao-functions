import { Module } from '@nestjs/common';
import { PresetMenuController } from './preset-menu.controller';
import { PresetMenuService } from './preset-menu.service';

@Module({
  controllers: [PresetMenuController],
  providers: [PresetMenuService],
})
export class PresetMenuModule {}
