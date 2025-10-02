import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Status } from 'src/domain/entities/enums/status.enum';
import { WeeklyTime } from '../../time/weekly-time.swagger';

export class CreateEnrollmentDTO {
  @IsEmpty()
  enrollmentID?: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  salary: number;

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

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  coachID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  gymID: number;
}
