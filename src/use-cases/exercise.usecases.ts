import { IException } from 'src/domain/adapters/exceptions.interface';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateExerciseDTO } from 'src/domain/models/exercise/dtos/create-exercise.dto';
import { UpdateExerciseDTO } from 'src/domain/models/exercise/dtos/update-exercise.dto';
import { ExercisePresenter } from 'src/domain/models/exercise/presenters/exercise.presenter';
import { IExerciseRepository } from 'src/domain/repositories/exercise-repository.interface';

export class ExerciseUseCases {
  constructor(
    private readonly exerciseRepository: IExerciseRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<ExercisePresenter>> {
    const response = await this.exerciseRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const exercises = response.exercises.map(
      (exercise) => new ExercisePresenter(exercise),
    );

    return { data: exercises, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.exerciseRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<ExercisePresenter> {
    const exercise = await this.exerciseRepository.findOneById(id);
    return new ExercisePresenter(exercise);
  }

  async create(exerciseData: CreateExerciseDTO): Promise<ExercisePresenter> {
    const newExercise = await this.exerciseRepository.create(exerciseData);
    return new ExercisePresenter(newExercise);
  }

  async update(
    id: number,
    exerciseData: UpdateExerciseDTO,
  ): Promise<ExercisePresenter> {
    const exercise = await this.exerciseRepository.update(id, exerciseData);
    return new ExercisePresenter(exercise);
  }

  async delete(id: number): Promise<void> {
    await this.exerciseRepository.remove(id);
  }
}
