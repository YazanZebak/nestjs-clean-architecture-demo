import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { MuscleName } from 'src/domain/entities/enums/muscle-name.enum';

export class CreateExerciseDTO {
  @IsEmpty()
  exerciseID?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  video?: string;

  @ApiProperty({ enum: MuscleName })
  @IsNotEmpty()
  @IsEnum(MuscleName)
  muscle: MuscleName;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;
}
