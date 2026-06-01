import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private health: HealthService) {}

  @Get()
  @ApiOperation({ operationId: 'getInfo' })
  getInfo() {
    return {
      status: 'running',
      version: '1.0.0',
      by: 'Hatohui',
      for: 'yaoyaodinner',
      message: 'Smh I spotted a stalking bean!',
    };
  }

  @Get('health')
  @ApiOperation({ operationId: 'getHealth' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async checkAll() {
    const services: Record<string, any> = {
      database: { status: 'healthy' },
      redis: { status: 'healthy' },
    };
    let healthy = true;

    try {
      await this.health.checkDatabase();
    } catch (e) {
      services.database = { status: 'unhealthy', message: e.message };
      healthy = false;
    }

    try {
      await this.health.checkRedis();
    } catch (e) {
      services.redis = { status: 'unhealthy', message: e.message };
      healthy = false;
    }

    return { status: healthy ? 'ok' : 'degraded', services };
  }

  @Get('database')
  @ApiOperation({ operationId: 'checkDatabase' })
  async checkDatabase() {
    await this.health.checkDatabase();
    return { status: 'ok', message: 'Database connection is healthy' };
  }

  @Get('redis')
  @ApiOperation({ operationId: 'checkRedis' })
  async checkRedis() {
    await this.health.checkRedis();
    return { status: 'ok', message: 'Redis connection is healthy' };
  }
}
