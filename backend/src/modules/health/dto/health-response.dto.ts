import { ApiProperty } from "@nestjs/swagger";

export class ServiceStatusDto {
  @ApiProperty({ enum: ["healthy", "unhealthy"] }) status: string;
  @ApiProperty({ required: false, type: Number }) latency?: number;
  @ApiProperty({ nullable: true, type: String, required: false }) message?: string;
}

export class HealthServicesDto {
  @ApiProperty({ type: ServiceStatusDto }) database: ServiceStatusDto;
  @ApiProperty({ type: ServiceStatusDto }) redis: ServiceStatusDto;
}

export class MemoryMetricsDto {
  @ApiProperty() heapUsed: number;
  @ApiProperty() heapTotal: number;
  @ApiProperty() rss: number;
}

export class SystemMetricsDto {
  @ApiProperty() uptime: number;
  @ApiProperty({ type: MemoryMetricsDto }) memory: MemoryMetricsDto;
}

export class HealthResponseDto {
  @ApiProperty({ enum: ["ok", "degraded"] }) status: string;
  @ApiProperty({ type: SystemMetricsDto }) system: SystemMetricsDto;
  @ApiProperty({ type: HealthServicesDto }) services: HealthServicesDto;
}
