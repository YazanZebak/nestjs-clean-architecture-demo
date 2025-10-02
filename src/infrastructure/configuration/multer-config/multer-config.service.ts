import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { StorageService } from '../../services/storage/storage.service';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { sanitize } from 'sanitize-filename-ts';
import * as uuid from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private storageService: StorageService) {}

  private _removeIllegealCharacters(filename: string) {
    return sanitize(filename);
  }

  fileTypeFilter(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) {
    if (!file.mimetype.match(/(image|pdf)/)) {
      callback(
        new UnsupportedMediaTypeException(
          'Only pdf and image files are allowed.',
        ),
        false,
      );
    }

    callback(null, true);
  }

  mediaFileName(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) {
    const filename = this._removeIllegealCharacters(file.originalname);
    const name = [uuid.v4(), filename].join('-');
    callback(null, name);
  }

  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    const options = {
      fileFilter: this.fileTypeFilter.bind(this),
      storage: diskStorage({
        destination: this.storageService.getMediaDirectoryPath(),
        filename: this.mediaFileName.bind(this),
      }),
    } as MulterOptions;
    return options;
  }
}
