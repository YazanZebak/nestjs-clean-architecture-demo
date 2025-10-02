import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Account } from 'src/domain/entities/account.entity';
import { Category } from 'src/domain/entities/category.entity';
import { Gender } from 'src/domain/entities/enums/gender.enum';

export class CreateCoachDTO {
  @IsEmpty()
  coachID?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  age: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  yearsOfExperience: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificatePath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  about?: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  accountID: number;

  category?: Category;

  account?: Account;
}
