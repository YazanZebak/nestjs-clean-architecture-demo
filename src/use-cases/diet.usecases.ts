import { IException } from 'src/domain/adapters/exceptions.interface';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateDietDTO } from 'src/domain/models/diet/dtos/create-diet.dto';
import { UpdateDietDTO } from 'src/domain/models/diet/dtos/update-diet.dto';
import { DietPresenter } from 'src/domain/models/diet/presenters/diet.presenter';
import { IDietRepository } from 'src/domain/repositories/diet-repository.interface';
import { ITrainingRepository } from 'src/domain/repositories/training-repository.interface';

export class DietUseCases {
  constructor(
    private readonly dietRepository: IDietRepository,
    private readonly trainingRepository: ITrainingRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<DietPresenter>> {
    const response = await this.dietRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const diets = response.diets.map((diet) => new DietPresenter(diet));

    return { data: diets, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.dietRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<DietPresenter> {
    const diet = await this.dietRepository.findOneById(id);
    return new DietPresenter(diet);
  }

  async create(dietData: CreateDietDTO): Promise<DietPresenter> {
    const newDiet = await this.dietRepository.create(dietData);
    return new DietPresenter(newDiet);
  }

  async update(id: number, dietData: UpdateDietDTO): Promise<DietPresenter> {
    const diet = await this.dietRepository.update(id, dietData);
    return new DietPresenter(diet);
  }

  async delete(id: number): Promise<void> {
    await this.dietRepository.remove(id);
  }
}
