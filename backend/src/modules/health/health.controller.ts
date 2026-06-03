import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthService } from "./health.service";
import { HealthResponseDto } from "./dto/health-response.dto";

@ApiTags("health")
@Controller()
export class HealthController {
  constructor(private health: HealthService) {}

  @Get()
  @ApiOperation({ operationId: "getInfo" })
  getInfo() {
    return {
      status: "running",
      version: "1.0.0",
      by: "Hatohui",
      for: "yaoyaodinner",
      message: "Smh I spotted a stalking bean!",
    };
  }

  @Get("health")
  @ApiOperation({ operationId: "getHealth" })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async checkAll() {
    const system = this.health.getSystemMetrics();
    const services: Record<string, any> = {
      database: { status: "healthy" },
      redis: { status: "healthy" },
    };
    let healthy = true;

    try {
      const { latency } = await this.health.checkDatabase();
      services.database.latency = latency;
    } catch (e: Error | unknown) {
      services.database = {
        status: "unhealthy",
        message: (e as Error).message,
      };
      healthy = false;
    }

    try {
      const { latency } = await this.health.checkRedis();
      services.redis.latency = latency;
    } catch (e: Error | unknown) {
      services.redis = { status: "unhealthy", message: (e as Error).message };
      healthy = false;
    }

    return {
      status: healthy ? "ok" : "degraded",
      system,
      services,
    };
  }

  @Get("database")
  @ApiOperation({ operationId: "checkDatabase" })
  async checkDatabase() {
    const { latency } = await this.health.checkDatabase();
    return { status: "ok", latency };
  }

  @Get("redis")
  @ApiOperation({ operationId: "checkRedis" })
  async checkRedis() {
    const { latency } = await this.health.checkRedis();
    return { status: "ok", latency };
  }
}
