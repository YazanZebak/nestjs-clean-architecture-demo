import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { MealItem } from 'src/domain/entities/interfaces/meal-item.interface';

export class MealItemDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meal: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  quantity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  order: number;

  constructor(item: MealItem) {
    this.meal = item?.meal;
    this.quantity = item?.quantity;
    this.time = item?.time;
    this.description = item?.description;
    this.order = item?.order;
  }
}
