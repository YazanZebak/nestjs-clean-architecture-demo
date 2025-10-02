import { Exercise } from '../entities/exercise.entity';
import { CreateExerciseDTO } from '../models/exercise/dtos/create-exercise.dto';
import { UpdateExerciseDTO } from '../models/exercise/dtos/update-exercise.dto';

export interface IExerciseRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ exercises: Exercise[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Exercise>;

  findOneBy(
    property: keyof Exercise,
    value: any,
  ): Promise<Exercise | undefined>;

  create(exerciseData: CreateExerciseDTO): Promise<Exercise>;

  update(id: number, exerciseData: UpdateExerciseDTO): Promise<Exercise>;

  remove(id: number): Promise<void>;
}
