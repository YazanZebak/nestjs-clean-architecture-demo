import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsArray,
} from 'class-validator';
import { MealItem } from 'src/domain/entities/interfaces/meal-item.interface';
import { DietItemDTO } from '../diet-item.swagger';

export class UpdateDietDTO {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate: Date;

  @ApiPropertyOptional({
    type: DietItemDTO,
    name: 'days',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  days: { day: string; meals: MealItem[] }[];

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  trainingID: number;
}
