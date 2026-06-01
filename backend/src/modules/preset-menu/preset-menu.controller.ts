import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PresetMenuService } from './preset-menu.service';
import { CreatePresetDto } from './dto/create-preset.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('preset-menus')
@Controller('preset-menus')
export class PresetMenuController {
  constructor(private preset: PresetMenuService) {}

  @Get()
  @ApiOperation({ operationId: 'getPresetMenus' })
  findAll() {
    return this.preset.findAll();
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getPresetMenuById' })
  findOne(@Param('id') id: string) {
    return this.preset.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'createPresetMenu' })
  create(@Body() dto: CreatePresetDto) {
    return this.preset.create(dto);
  }
}
