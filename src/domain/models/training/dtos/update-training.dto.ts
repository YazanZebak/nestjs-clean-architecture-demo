import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmpty, IsOptional, IsDateString } from 'class-validator';
import { Status } from 'src/domain/entities/enums/status.enum';

export class UpdateTrainingDTO {
  @IsEmpty()
  trainingID?: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  status?: Status;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsEmpty()
  playerID?: number;

  @IsEmpty()
  coachID?: number;
}
