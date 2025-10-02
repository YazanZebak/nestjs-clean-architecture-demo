import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';
import { Status } from 'src/domain/entities/enums/status.enum';

export class CreateTrainingDTO {
  @IsEmpty()
  trainingID?: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  status?: Status;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  playerID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  coachID: number;
}
