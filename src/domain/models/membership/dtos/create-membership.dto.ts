import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Status } from 'src/domain/entities/enums/status.enum';

export class CreateMembershipDTO {
  @IsEmpty()
  membershipID?: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paid: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @IsEmpty()
  status?: Status;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  playerID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  gymID: number;
}
