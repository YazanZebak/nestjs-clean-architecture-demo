import { ApiProperty } from '@nestjs/swagger';
import { MuscleName } from 'src/domain/entities/enums/muscle-name.enum';
import { Exercise } from 'src/domain/entities/exercise.entity';

export class ExercisePresenter {
  @ApiProperty()
  exerciseID: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  video: string;

  @ApiProperty({ enum: MuscleName })
  muscle: MuscleName;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  constructor(exercise: Exercise) {
    this.exerciseID = exercise?.exerciseID;
    this.name = exercise?.name;
    this.description = exercise?.description;
    this.video = exercise?.video;
    this.muscle = exercise?.muscle;
    this.createdAt = exercise?.createdAt;
    this.deletedAt = exercise?.deletedAt;
  }
}
