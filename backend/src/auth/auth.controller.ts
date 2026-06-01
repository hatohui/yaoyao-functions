import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'login' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('register')
  @ApiOperation({ operationId: 'register' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }
}
