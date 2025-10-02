import { ApiProperty } from '@nestjs/swagger';
import { Training } from 'src/domain/entities/training.entity';
import { TrainingPresenter } from '../../training/presenter/training.presenter';
import { Rating } from 'src/domain/entities/rating.entity';

export class RatingPresenter {
  @ApiProperty()
  ratingID: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({
    type: TrainingPresenter,
    name: 'training',
  })
  training: Training;

  constructor(rating: Rating) {
    this.ratingID = rating?.ratingID;
    this.createdAt = rating?.createdAt;
    this.deletedAt = rating?.deletedAt;
    this.value = rating?.value;
    this.training = rating?.training;
  }
}
