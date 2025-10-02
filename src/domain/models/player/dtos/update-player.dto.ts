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
import { Gender } from 'src/domain/entities/enums/gender.enum';

export class UpdatePlayerDTO {
  @IsEmpty()
  playerID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  age?: number;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  height?: number;

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

  @IsEmpty()
  accountID?: number;
}
