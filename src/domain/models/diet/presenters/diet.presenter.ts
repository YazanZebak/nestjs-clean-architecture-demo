import { ApiProperty } from '@nestjs/swagger';
import { Diet } from 'src/domain/entities/diet.entity';
import { Training } from 'src/domain/entities/training.entity';
import { TrainingPresenter } from '../../training/presenter/training.presenter';
import { DietItemDTO } from '../diet-item.swagger';
import { MealItem } from 'src/domain/entities/interfaces/meal-item.interface';

export class DietPresenter {
  @ApiProperty()
  dietID: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({
    type: DietItemDTO,
    name: 'days',
    isArray: true,
  })
  days: { day: string; meals: MealItem[] }[];

  @ApiProperty({
    type: TrainingPresenter,
    name: 'training',
  })
  training: Training;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  constructor(diet: Diet) {
    this.dietID = diet?.dietID;
    this.name = diet?.name;
    this.description = diet?.description;
    this.startDate = diet?.startDate;
    this.endDate = diet?.endDate;
    this.days = diet?.days;
    this.createdAt = diet?.createdAt;
    this.deletedAt = diet?.deletedAt;
    this.training = diet?.training;
  }
}
