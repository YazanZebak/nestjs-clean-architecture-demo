import {
  Controller,
  Inject,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaUseCases } from 'src/use-cases/media.usecases';
import { MediaPresenter } from 'src/domain/models/media/presenters/media.presenter';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(
    @Inject(UsecasesProxyModule.MEDIA_USECASES_PROXY)
    private readonly mediaUseCases: UseCaseProxy<MediaUseCases>,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: MediaPresenter })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.mediaUseCases.getInstance().upload(files);
  }
}
