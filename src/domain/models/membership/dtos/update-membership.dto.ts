import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Status } from 'src/domain/entities/enums/status.enum';

export class UpdateMembershipDTO {
  @IsEmpty()
  membershipID?: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  paid?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fee?: number;

  @IsEmpty()
  status?: Status;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsEmpty()
  playerID?: number;

  @IsEmpty()
  gymID?: number;
}
