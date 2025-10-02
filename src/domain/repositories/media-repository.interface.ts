import { MediaType } from '../entities/enums/media-type.enum';
import { Media } from '../entities/media.entity';

export interface IMediaRepository {
  findOneById(id: number): Promise<Media>;

  findOneBy(property: keyof Media, value: any): Promise<Media | undefined>;

  create(mediaData: { path: string; type: MediaType }): Promise<Media>;

  remove(id: number): Promise<void>;
}
