import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { MediaType } from 'src/domain/entities/enums/media-type.enum';
import { Media } from 'src/domain/entities/media.entity';

@ApiTags('Media')
export class MediaPresenter {
  @ApiProperty()
  mediaID: number;

  @ApiProperty({ enum: MediaType })
  type: MediaType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  path: string;

  constructor(media: Media) {
    this.mediaID = media?.mediaID;
    this.type = media?.type;
    this.path = media?.path;
    this.createdAt = media?.createdAt;
  }
}
