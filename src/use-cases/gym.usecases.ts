import { IException } from 'src/domain/adapters/exceptions.interface';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateGymDTO } from 'src/domain/models/gym/dtos/create-gym.dto';
import { UpdateGymDTO } from 'src/domain/models/gym/dtos/update-gym.dto';
import { GymPresenter } from 'src/domain/models/gym/presenters/gym.presenter';
import { IAccountRepository } from 'src/domain/repositories/account-repository.interface';
import { IGymRepository } from 'src/domain/repositories/gym-repositroy.interface';

export class GymUseCases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly gymRepository: IGymRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<GymPresenter>> {
    const response = await this.gymRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const gyms = response.gyms.map((gyms) => new GymPresenter(gyms));

    return { data: gyms, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.gymRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<GymPresenter> {
    const gym = await this.gymRepository.findOneById(id);
    return new GymPresenter(gym);
  }

  async findOneByAccount(accountID: number): Promise<GymPresenter> {
    const gym = await this.gymRepository.findOneBy('account', {
      accountID,
    });
    return new GymPresenter(gym);
  }

  async create(gymData: CreateGymDTO): Promise<GymPresenter> {
    const newGym = await this.gymRepository.create(gymData);
    return new GymPresenter(newGym);
  }

  async update(id: number, gymData: UpdateGymDTO): Promise<GymPresenter> {
    const gym = await this.gymRepository.update(id, gymData);
    return new GymPresenter(gym);
  }

  async delete(id: number): Promise<void> {
    await this.gymRepository.remove(id);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    return this.gymRepository.statistics(start, end);
  }
}
