import { IException } from 'src/domain/adapters/exceptions.interface';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateCoachDTO } from 'src/domain/models/coach/dtos/create-coach.dto';
import { UpdateCoachDTO } from 'src/domain/models/coach/dtos/update-coach.dto';
import { CoachPresenter } from 'src/domain/models/coach/presenters/coach.presenter';
import { IAccountRepository } from 'src/domain/repositories/account-repository.interface';
import { ICategoryRepository } from 'src/domain/repositories/category-repository.interface';
import { ICoachRepository } from 'src/domain/repositories/coach-repository.interface';

export class CoachUseCases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly coachRepository: ICoachRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<CoachPresenter>> {
    const response = await this.coachRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const coaches = response.coaches.map((coach) => new CoachPresenter(coach));

    return { data: coaches, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.coachRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<CoachPresenter> {
    const coach = await this.coachRepository.findOneById(id);
    return new CoachPresenter(coach);
  }

  async findOneByAccount(accountID: number): Promise<CoachPresenter> {
    const coach = await this.coachRepository.findOneBy('account', {
      accountID,
    });
    return new CoachPresenter(coach);
  }

  async create(coachData: CreateCoachDTO): Promise<CoachPresenter> {
    const newCoach = await this.coachRepository.create(coachData);
    return new CoachPresenter(newCoach);
  }

  async update(id: number, coachData: UpdateCoachDTO): Promise<CoachPresenter> {
    const coach = await this.coachRepository.update(id, coachData);
    return new CoachPresenter(coach);
  }

  async delete(id: number): Promise<void> {
    await this.coachRepository.remove(id);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    return this.coachRepository.statistics(start, end);
  }
}
