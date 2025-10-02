import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsEmpty } from 'class-validator';

export class UpdateCategoryDTO {
  @IsEmpty()
  categoryID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;
}
