import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/domain/entities/category.entity';
import { Coach } from 'src/domain/entities/coach.entity';
import { CoachPresenter } from '../../coach/presenters/coach.presenter';

export class CategoryPresenter {
  @ApiProperty()
  categoryID: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({
    type: CoachPresenter,
    name: 'coaches',
    isArray: true,
  })
  coaches: Coach[];

  constructor(category: Category) {
    this.categoryID = category?.categoryID;
    this.name = category?.name;
    this.icon = category?.icon;
    this.createdAt = category?.createdAt;
    this.deletedAt = category?.deletedAt;
    this.coaches = category?.coaches || [];
  }
}
