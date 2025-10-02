import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaType } from 'src/domain/entities/enums/media-type.enum';
import { Media } from 'src/domain/entities/media.entity';
import { IMediaRepository } from 'src/domain/repositories/media-repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MediaRepository implements IMediaRepository {
  constructor(
    @InjectRepository(Media)
    private readonly mediaEntityRepository: Repository<Media>,
  ) {}

  async findOneById(id: number): Promise<Media> {
    return this.mediaEntityRepository.findOneBy({ mediaID: id });
  }

  async findOneBy(property: keyof Media | string, value: any): Promise<Media> {
    const condition = {};
    condition[property] = value;
    return this.mediaEntityRepository.findOne({ where: condition });
  }

  async create(mediaData: { path: string; type: MediaType }): Promise<Media> {
    const media = this.mediaEntityRepository.create(mediaData);
    return this.mediaEntityRepository.save(media);
  }

  async remove(id: number): Promise<void> {
    throw new NotImplementedException();
  }
}
