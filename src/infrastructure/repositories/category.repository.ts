import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/domain/entities/category.entity';
import { CreateCategoryDTO } from 'src/domain/models/category/dtos/create-category.dto';
import { UpdateCategoryDTO } from 'src/domain/models/category/dtos/update-category.dto';
import { ICategoryRepository } from 'src/domain/repositories/category-repository.interface';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryEntityRepository: Repository<Category>,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ categories: Category[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    const where = {};

    if (filter) {
      Object.entries(filter).forEach(([property, value]) => {
        where[property] = value;
      });
    }

    if (search) {
      where['name'] = ILike(`%${search}%`);
    }

    const options: FindManyOptions<Category> = {
      where,
      skip,
      take: limit,
    };

    const [categories, count] =
      await this.categoryEntityRepository.findAndCount(options);

    return { categories: categories, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.categoryEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Category> {
    const category = await this.categoryEntityRepository.findOne({
      where: { categoryID: id },
      relations: ['coaches', 'coaches.trainings', 'coaches.trainings.ratings'],
    });

    if (!category || category === null) {
      this.exceptionService.NotFoundException({
        message: 'Categroy does not exist',
        errorCode: 404,
      });
    }

    const cat: any = category;

    cat.coaches = category.coaches.map((coach) => {
      const newCoach = {
        ...coach,
        rating:
          coach.trainings
            .map((training) => training.ratings.map((rating) => +rating.value))
            .flat()
            .reduce((total, value) => total + value, 0) /
          coach.trainings.length,
      };
      delete newCoach.trainings;
      return newCoach;
    });

    return category;
  }

  async findOneBy(
    property: keyof Category | string,
    value: any,
  ): Promise<Category> {
    const condition = {};
    condition[property] = value;
    return this.categoryEntityRepository.findOne({ where: condition });
  }

  async create(categoryData: CreateCategoryDTO): Promise<Category> {
    const category = this.categoryEntityRepository.create(categoryData);
    return this.categoryEntityRepository.save(category);
  }

  async update(id: number, categoryData: UpdateCategoryDTO): Promise<Category> {
    await this.categoryEntityRepository.update(id, categoryData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    throw new NotImplementedException();
  }
}
