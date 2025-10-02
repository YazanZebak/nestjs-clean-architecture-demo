import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ExerciseItem } from 'src/domain/entities/interfaces/exercise-item.interface';
import { ProgramItemDTO } from '../program-item.swagger';

export class UpdateProgramDTO {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({
    type: ProgramItemDTO,
    name: 'days',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  days?: { day: string; exercises: ExerciseItem[] }[];

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  trainingID?: number;
}
