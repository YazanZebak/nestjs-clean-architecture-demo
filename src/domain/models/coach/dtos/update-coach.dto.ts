import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Category } from 'src/domain/entities/category.entity';
import { Gender } from 'src/domain/entities/enums/gender.enum';

export class UpdateCoachDTO {
  @IsEmpty()
  coachID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  age: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  yearsOfExperience: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificatePath: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  about?: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  categoryID: number;

  @IsEmpty()
  accountID?: number;

  category?: Category;
}
