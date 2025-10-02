import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { MealItem } from 'src/domain/entities/interfaces/meal-item.interface';
import { MealItemDTO } from './meal-item.swagger';

export class DietItemDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  day: string;

  @ApiProperty({
    type: MealItemDTO,
    name: 'meals',
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  meals: MealItem[];

  constructor(item: DietItemDTO) {
    this.day = item?.day;
    this.meals = item?.meals;
  }
}
