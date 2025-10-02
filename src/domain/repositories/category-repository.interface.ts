import { Category } from '../entities/category.entity';
import { CreateCategoryDTO } from '../models/category/dtos/create-category.dto';
import { UpdateCategoryDTO } from '../models/category/dtos/update-category.dto';

export interface ICategoryRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ categories: Category[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Category>;

  findOneBy(
    property: keyof Category,
    value: any,
  ): Promise<Category | undefined>;

  create(categoryData: CreateCategoryDTO): Promise<Category>;

  update(id: number, categoryData: UpdateCategoryDTO): Promise<Category>;

  remove(id: number): Promise<void>;
}
