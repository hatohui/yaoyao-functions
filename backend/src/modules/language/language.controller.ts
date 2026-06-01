import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LanguageService } from './language.service';

@ApiTags('languages')
@Controller('languages')
export class LanguageController {
  constructor(private language: LanguageService) {}

  @Get()
  @ApiOperation({ operationId: 'getLanguages' })
  findAll() {
    return this.language.findAll();
  }

  @Get('codes')
  @ApiOperation({ operationId: 'getLanguageCodes' })
  findCodes() {
    return this.language.findCodes();
  }
}
