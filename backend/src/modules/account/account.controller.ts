import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private account: AccountService) {}

  @Get()
  @ApiOperation({ operationId: 'getAccounts' })
  findAll() {
    return this.account.findAll();
  }
}
