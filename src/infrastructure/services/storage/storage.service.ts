import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { join } from 'path';
import { IStorageService } from 'src/domain/adapters/storage.interface';
import { MediaType } from 'src/domain/entities/enums/media-type.enum';

@Injectable()
export class StorageService implements IStorageService {
  private readonly mediaDir: string = 'public';

  getMediaDirectoryPath(): string {
    return join(this.mediaDir);
  }

  mimetypeToMediaType(mimetype: string): MediaType {
    if (mimetype.includes('image')) return MediaType.IMAGE;
    else if (mimetype.includes('pdf')) return MediaType.PDF;
    else throw new UnsupportedMediaTypeException();
  }
}
