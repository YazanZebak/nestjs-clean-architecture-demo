import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsIn,
  IsPhoneNumber,
  IsEmpty,
} from 'class-validator';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Status } from 'src/domain/entities/enums/status.enum';

export class CreateAccountDTO {
  @IsEmpty()
  accountID?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: AccountRole })
  @IsNotEmpty()
  @IsEnum(AccountRole)
  role: AccountRole;

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
