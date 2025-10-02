import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsEmpty,
} from 'class-validator';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Status } from 'src/domain/entities/enums/status.enum';

export class UpdateAccountDTO {
  @IsEmpty()
  accountID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEmpty()
  role?: AccountRole;

  @IsEmpty()
  active?: Status;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsEmpty()
  coins?: number;
}
