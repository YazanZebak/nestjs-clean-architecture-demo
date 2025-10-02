import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { WeeklyTime } from '../../time/weekly-time.swagger';
import { Status } from 'src/domain/entities/enums/status.enum';

export class UpdateEnrollmentDTO {
  @IsEmpty()
  enrollmentID?: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiPropertyOptional({
    type: WeeklyTime,
    name: 'shiftTimes',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  shiftTimes?: WeeklyTime[];

  @IsEmpty()
  status?: Status;

  @IsEmpty()
  coachID?: number;

  @IsEmpty()
  gymID?: number;
}
