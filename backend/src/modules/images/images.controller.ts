import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { SignUrlResponseDto } from './dto/sign-url-response.dto';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private images: ImagesService) {}

  @Get('sign-url')
  @ApiOperation({ operationId: 'getSignedUrl' })
  @ApiQuery({ name: 'folder', required: true, type: String })
  @ApiResponse({ status: 200, type: SignUrlResponseDto })
  signUrl(@Query('folder') folder: string) {
    if (!folder) throw new BadRequestException('folder query param is required');
    return this.images.signUrl(folder);
  }
}
