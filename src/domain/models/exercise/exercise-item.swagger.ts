import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ExercisePresenter } from './presenters/exercise.presenter';
import { Exercise } from 'src/domain/entities/exercise.entity';
import { ExerciseItem } from 'src/domain/entities/interfaces/exercise-item.interface';

export class ExerciseItemDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  sets: number;

  @ApiProperty({
    type: Number,
    name: 'reps',
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  reps: number[];

  @ApiProperty({
    type: ExercisePresenter,
    name: 'exercise',
  })
  @IsNotEmpty()
  exercise: Exercise;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  order: number;

  constructor(item: ExerciseItem) {
    this.sets = item?.sets;
    this.reps = item?.reps;
    this.exercise = item?.exercise;
    this.order = item?.order;
  }
}
