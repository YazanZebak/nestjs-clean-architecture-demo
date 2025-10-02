import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Account } from 'src/domain/entities/account.entity';
import { WeeklyTime } from '../../time/weekly-time.swagger';
import { Category } from 'src/domain/entities/category.entity';
import { CategoryPresenter } from '../../category/presenters/category.presenter';

export class CreateGymDTO {
  @IsEmpty()
  gymID?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('SY')
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

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

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  accountID: number;

  account?: Account;
}
