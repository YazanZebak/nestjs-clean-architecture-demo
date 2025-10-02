import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ExerciseItemDTO } from '../exercise/exercise-item.swagger';
import { ExerciseItem } from 'src/domain/entities/interfaces/exercise-item.interface';

export class ProgramItemDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  day: string;

  @ApiProperty({
    type: ExerciseItemDTO,
    name: 'exercises',
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  exercises: ExerciseItem[];

  constructor(item: ProgramItemDTO) {
    this.day = item?.day;
    this.exercises = item?.exercises;
  }
}
