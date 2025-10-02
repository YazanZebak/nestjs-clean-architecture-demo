import { join } from 'path';
import { IException } from 'src/domain/adapters/exceptions.interface';
import { IStorageService } from 'src/domain/adapters/storage.interface';
import { MediaPresenter } from 'src/domain/models/media/presenters/media.presenter';
import { IMediaRepository } from 'src/domain/repositories/media-repository.interface';

export class MediaUseCases {
  constructor(
    private readonly mediaRepository: IMediaRepository,
    private readonly exceptionService: IException,
    private readonly storageService: IStorageService,
  ) {}

  private _getFilePath(file: Express.Multer.File) {
    const dir = this.storageService.getMediaDirectoryPath();
    const path = join(dir, file.filename);
    const normalizedPath = path.replace(/\\/g, '/');
    const type = this.storageService.mimetypeToMediaType(file.mimetype);
    return { path: normalizedPath, type: type };
  }

  async upload(files: Array<Express.Multer.File>): Promise<MediaPresenter[]> {
    const info = files.map((file) => this._getFilePath(file));

    const media: MediaPresenter[] = [];
    for (const piece of info) {
      const entity = await this.mediaRepository.create(piece);
      media.push(new MediaPresenter(entity));
    }

    return media;
  }
}
