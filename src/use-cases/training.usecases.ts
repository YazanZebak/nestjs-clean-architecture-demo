import { IException } from 'src/domain/adapters/exceptions.interface';
import { Status } from 'src/domain/entities/enums/status.enum';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateTrainingDTO } from 'src/domain/models/training/dtos/create-training.dto';
import { UpdateTrainingDTO } from 'src/domain/models/training/dtos/update-training.dto';
import { TrainingPresenter } from 'src/domain/models/training/presenter/training.presenter';
import { ICoachRepository } from 'src/domain/repositories/coach-repository.interface';
import { IPlayerRepository } from 'src/domain/repositories/player-repository.interface';
import { ITrainingRepository } from 'src/domain/repositories/training-repository.interface';

export class TrainingUseCases {
  constructor(
    private readonly trainingRepository: ITrainingRepository,
    private readonly playerRepository: IPlayerRepository,
    private readonly coachRepository: ICoachRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<TrainingPresenter>> {
    const response = await this.trainingRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const trainings = response.trainings.map(
      (training) => new TrainingPresenter(training),
    );

    return { data: trainings, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.trainingRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<TrainingPresenter> {
    const training = await this.trainingRepository.findOneById(id);
    return new TrainingPresenter(training);
  }

  async create(trainingData: CreateTrainingDTO): Promise<TrainingPresenter> {
    const newTraining = await this.trainingRepository.create({
      ...trainingData,
      status: Status.PENDING,
    });
    return new TrainingPresenter(newTraining);
  }

  async createFromGym(
    trainingData: CreateTrainingDTO,
  ): Promise<TrainingPresenter> {
    const newTraining = await this.trainingRepository.create({
      ...trainingData,
      status: Status.ACCEPT,
    });
    return new TrainingPresenter(newTraining);
  }

  async accept(id: number): Promise<TrainingPresenter> {
    const updatedTraining = await this.update(id, {
      status: Status.ACCEPT,
    });
    return updatedTraining;
  }

  async reject(id: number): Promise<TrainingPresenter> {
    const updatedTraining = await this.update(id, {
      status: Status.REJECT,
    });
    return updatedTraining;
  }

  async update(
    id: number,
    trainingData: UpdateTrainingDTO,
  ): Promise<TrainingPresenter> {
    const training = await this.trainingRepository.update(id, trainingData);
    return new TrainingPresenter(training);
  }

  async delete(id: number): Promise<void> {
    await this.trainingRepository.remove(id);
  }
}
