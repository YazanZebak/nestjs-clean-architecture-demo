import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ExerciseItem } from 'src/domain/entities/interfaces/exercise-item.interface';
import { ProgramItemDTO } from '../program-item.swagger';
import { Training } from 'src/domain/entities/training.entity';

export class CreateProgramDTO {
  @IsEmpty()
  programID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    type: ProgramItemDTO,
    name: 'days',
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  days: { day: string; exercises: ExerciseItem[] }[];

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  trainingID: number;

  training?: Training;
}
