import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsEnum,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsEmpty,
  IsOptional,
} from 'class-validator';
import { Account } from 'src/domain/entities/account.entity';
import { Gender } from 'src/domain/entities/enums/gender.enum';

export class CreatePlayerDTO {
  @IsEmpty()
  playerID?: number;

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

  @ApiProperty({ enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  weight: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  height: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  yearsOfPlaying?: number;

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
  accountID: number;

  account?: Account;
}
