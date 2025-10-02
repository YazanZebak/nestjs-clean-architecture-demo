import { Diet } from '../entities/diet.entity';
import { CreateDietDTO } from '../models/diet/dtos/create-diet.dto';
import { UpdateDietDTO } from '../models/diet/dtos/update-diet.dto';

export interface IDietRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ diets: Diet[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Diet>;

  findOneBy(property: keyof Diet, value: any): Promise<Diet | undefined>;

  create(dietData: CreateDietDTO): Promise<Diet>;

  update(id: number, dietData: UpdateDietDTO): Promise<Diet>;

  remove(id: number): Promise<void>;
}
