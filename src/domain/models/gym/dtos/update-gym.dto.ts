import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { WeeklyTime } from '../../time/weekly-time.swagger';
import { Category } from 'src/domain/entities/category.entity';
import { CategoryPresenter } from '../../category/presenters/category.presenter';

export class UpdateGymDTO {
  @IsEmpty()
  gymID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsPhoneNumber('SY')
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    type: CategoryPresenter,
    name: 'categories',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  categories?: Category[];

  @ApiPropertyOptional({
    type: WeeklyTime,
    name: 'openingTimes',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  openingTimes?: WeeklyTime[];

  @ApiPropertyOptional({
    type: String,
    name: 'gallery',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  gallery?: string[];

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  accountID?: number;
}
