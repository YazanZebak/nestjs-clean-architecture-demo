import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from 'src/domain/entities/exercise.entity';
import { CreateExerciseDTO } from 'src/domain/models/exercise/dtos/create-exercise.dto';
import { UpdateExerciseDTO } from 'src/domain/models/exercise/dtos/update-exercise.dto';
import { IExerciseRepository } from 'src/domain/repositories/exercise-repository.interface';
import { Repository, Like, FindManyOptions, ILike } from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';

@Injectable()
export class ExerciseRepository implements IExerciseRepository {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseEntityRepository: Repository<Exercise>,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ exercises: Exercise[]; count: number }> {
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
      where.push({ description: ILike(`%${search}%`) });
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

    const options: FindManyOptions<Exercise> = {
      where,
      skip,
      take: limit,
    };

    const [exercises, count] = await this.exerciseEntityRepository.findAndCount(
      options,
    );

    return { exercises: exercises, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.exerciseEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Exercise> {
    const exercise = await this.exerciseEntityRepository.findOne({
      where: { exerciseID: id },
    });

    if (!exercise || exercise === null) {
      this.exceptionService.NotFoundException({
        message: 'Exercise does not exsit',
        errorCode: 404,
      });
    }

    return exercise;
  }

  async findOneBy(
    property: keyof Exercise | string,
    value: any,
  ): Promise<Exercise> {
    const condition = {};
    condition[property] = value;
    return this.exerciseEntityRepository.findOne({ where: condition });
  }

  async create(exerciseData: CreateExerciseDTO): Promise<Exercise> {
    const exercise = this.exerciseEntityRepository.create(exerciseData);
    return this.exerciseEntityRepository.save(exercise);
  }

  async update(id: number, exerciseData: UpdateExerciseDTO): Promise<Exercise> {
    await this.exerciseEntityRepository.update(id, exerciseData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const exercise = await this.exerciseEntityRepository.findOne({
      where: { exerciseID: id },
    });
    await this.exerciseEntityRepository.softRemove(exercise);
  }
}
