import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diet } from 'src/domain/entities/diet.entity';
import { CreateDietDTO } from 'src/domain/models/diet/dtos/create-diet.dto';
import { UpdateDietDTO } from 'src/domain/models/diet/dtos/update-diet.dto';
import { IDietRepository } from 'src/domain/repositories/diet-repository.interface';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { TrainingRepository } from './training.repository';

@Injectable()
export class DietRepository implements IDietRepository {
  constructor(
    @InjectRepository(Diet)
    private readonly dietEntityRepository: Repository<Diet>,
    private readonly trainingRepository: TrainingRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ diets: Diet[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    let where = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
    }

    if (filter) {
      Object.entries(filter).forEach(([property, value]) => {
        if (where.length) {
          where = where.map((element) => {
            return { ...element, [property]: value };
          });
        } else {
          where[property] = value;
        }
      });
    }

    const options: FindManyOptions<Diet> = {
      where,
      skip,
      take: limit,
    };

    const [diets, count] = await this.dietEntityRepository.findAndCount(
      options,
    );

    return { diets: diets, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.dietEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Diet> {
    const diet = await this.dietEntityRepository.findOne({
      where: { dietID: id },
    });

    if (!diet || diet === null) {
      this.exceptionService.NotFoundException({
        message: 'Diet does not exsit',
        errorCode: 404,
      });
    }

    return diet;
  }

  async findOneBy(property: keyof Diet | string, value: any): Promise<Diet> {
    const condition = {};
    condition[property] = value;
    return this.dietEntityRepository.findOne({ where: condition });
  }

  async create(dietData: CreateDietDTO): Promise<Diet> {
    const training = await this.trainingRepository.findOneById(
      dietData.trainingID,
    );

    dietData.training = training;
    const diet = this.dietEntityRepository.create(dietData);
    return this.dietEntityRepository.save(diet);
  }

  async update(id: number, dietData: UpdateDietDTO): Promise<Diet> {
    await this.dietEntityRepository.update(id, dietData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const diet = await this.dietEntityRepository.findOne({
      where: { dietID: id },
    });
    await this.dietEntityRepository.softRemove(diet);
  }
}
