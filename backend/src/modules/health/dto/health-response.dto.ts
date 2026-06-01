import { ApiProperty } from '@nestjs/swagger';

export class ServiceStatusDto {
  @ApiProperty({ enum: ['healthy', 'unhealthy'] }) status: string;
  @ApiProperty({ nullable: true, type: String, required: false }) message?: string;
}

export class HealthServicesDto {
  @ApiProperty({ type: ServiceStatusDto }) database: ServiceStatusDto;
  @ApiProperty({ type: ServiceStatusDto }) redis: ServiceStatusDto;
}

export class HealthResponseDto {
  @ApiProperty({ enum: ['ok', 'degraded'] }) status: string;
  @ApiProperty({ type: HealthServicesDto }) services: HealthServicesDto;
}
