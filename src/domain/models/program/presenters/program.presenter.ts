import { ApiProperty } from '@nestjs/swagger';
import { ExerciseItem } from 'src/domain/entities/interfaces/exercise-item.interface';
import { ProgramItemDTO } from '../program-item.swagger';
import { Program } from 'src/domain/entities/program.entity';
import { Training } from 'src/domain/entities/training.entity';
import { TrainingPresenter } from '../../training/presenter/training.presenter';

export class ProgramPresenter {
  @ApiProperty()
  programID: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({
    type: ProgramItemDTO,
    name: 'days',
    isArray: true,
  })
  days: { day: string; exercises: ExerciseItem[] }[];

  @ApiProperty({
    type: TrainingPresenter,
    name: 'training',
  })
  training: Training;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  constructor(program: Program) {
    this.programID = program?.programID;
    this.name = program?.name;
    this.description = program?.description;
    this.startDate = program?.startDate;
    this.endDate = program?.endDate;
    this.days = program?.days;
    this.createdAt = program?.createdAt;
    this.deletedAt = program?.deletedAt;
    this.training = program?.training;
  }
}
