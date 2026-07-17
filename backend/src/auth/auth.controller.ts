import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { PinDto } from './dto/pin.dto';
import {
  AdminAuthResponseDto,
  PinAuthResponseDto,
} from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'verifyAdmin' })
  @ApiResponse({ status: 200, type: AdminAuthResponseDto })
  verifyAdmin(@Body() dto: AdminLoginDto) {
    return this.auth.verifyAdmin(dto.passphrase);
  }

  @Post('pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'verifyPin' })
  @ApiResponse({ status: 200, type: PinAuthResponseDto })
  verifyPin(@Body() dto: PinDto) {
    return this.auth.verifyPin(dto.pin);
  }
}
