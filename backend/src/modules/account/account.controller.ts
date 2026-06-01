import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('account')
@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private account: AccountService) {}

  @Get()
  @ApiOperation({ operationId: 'getAccounts' })
  findAll() {
    return this.account.findAll();
  }
}
