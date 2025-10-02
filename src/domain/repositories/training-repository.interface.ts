import { Training } from '../entities/training.entity';
import { CreateTrainingDTO } from '../models/training/dtos/create-training.dto';
import { UpdateTrainingDTO } from '../models/training/dtos/update-training.dto';

export interface ITrainingRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ trainings: Training[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Training>;

  findOneBy(
    property: keyof Training,
    value: any,
  ): Promise<Training | undefined>;

  create(trainingData: CreateTrainingDTO): Promise<Training>;

  update(id: number, trainingData: UpdateTrainingDTO): Promise<Training>;

  remove(id: number): Promise<void>;
}
