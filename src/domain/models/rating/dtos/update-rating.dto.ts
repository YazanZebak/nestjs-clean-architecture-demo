import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateRatingDTO {
  @IsEmpty()
  ratingID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  value?: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  trainingID?: number;
}
