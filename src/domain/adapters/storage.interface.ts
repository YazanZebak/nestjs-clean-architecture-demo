import { MediaType } from '../entities/enums/media-type.enum';

export interface IStorageService {
  getMediaDirectoryPath(): string;

  mimetypeToMediaType(mimetype: string): MediaType;
}
