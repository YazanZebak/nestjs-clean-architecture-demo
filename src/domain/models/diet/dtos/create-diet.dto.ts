import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsNumber,
} from 'class-validator';
import { MealItem } from 'src/domain/entities/interfaces/meal-item.interface';
import { Training } from 'src/domain/entities/training.entity';
import { DietItemDTO } from '../diet-item.swagger';

export class CreateDietDTO {
  @IsEmpty()
  dietID?: number;

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
    type: DietItemDTO,
    name: 'days',
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  days: { day: string; meals: MealItem[] }[];

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
