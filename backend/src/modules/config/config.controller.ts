import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ConfigService } from "./config.service";
import { AppConfigDto, UpdateConfigDto } from "./dto/config-response.dto";
import { AdminGuard } from "@common/guards/admin.guard";

@ApiTags("config")
@Controller("config")
export class ConfigController {
  constructor(private config: ConfigService) {}

  @Get("public")
  @ApiOperation({ operationId: "getPublicConfig" })
  @ApiResponse({ status: 200, type: Object })
  getPublic() {
    return this.config.getPublic();
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: "getConfig" })
  @ApiResponse({ status: 200, type: [AppConfigDto] })
  list() {
    return this.config.list();
  }

  @Patch(":key")
  @UseGuards(AdminGuard)
  @ApiOperation({ operationId: "updateConfig" })
  @ApiResponse({ status: 200, type: AppConfigDto })
  update(@Param("key") key: string, @Body() dto: UpdateConfigDto) {
    return this.config.set(key, dto.value);
  }
}
