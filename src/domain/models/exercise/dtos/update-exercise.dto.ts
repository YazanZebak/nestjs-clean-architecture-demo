import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { MuscleName } from 'src/domain/entities/enums/muscle-name.enum';

export class UpdateExerciseDTO {
  @IsEmpty()
  exerciseID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({ enum: MuscleName })
  @IsOptional()
  @IsEnum(MuscleName)
  muscle?: MuscleName;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;
}
