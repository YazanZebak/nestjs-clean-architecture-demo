import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Training } from 'src/domain/entities/training.entity';

export class CreateRatingDTO {
  @IsEmpty()
  ratingID?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  trainingID: number;

  training?: Training;
}
