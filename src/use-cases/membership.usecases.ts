import { IException } from 'src/domain/adapters/exceptions.interface';
import { Status } from 'src/domain/entities/enums/status.enum';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateMembershipDTO } from 'src/domain/models/membership/dtos/create-membership.dto';
import { UpdateMembershipDTO } from 'src/domain/models/membership/dtos/update-membership.dto';
import { MembershipPresenter } from 'src/domain/models/membership/presenters/membership.presenter';
import { IGymRepository } from 'src/domain/repositories/gym-repositroy.interface';
import { IMembershipRepository } from 'src/domain/repositories/membership-repository.interface';
import { IPlayerRepository } from 'src/domain/repositories/player-repository.interface';

export class MembershipUseCases {
  constructor(
    private readonly membershipRepository: IMembershipRepository,
    private readonly gymRepository: IGymRepository,
    private readonly playerRepository: IPlayerRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<MembershipPresenter>> {
    const response = await this.membershipRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const memberships = response.memberships.map(
      (membership) => new MembershipPresenter(membership),
    );

    return { data: memberships, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.membershipRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<MembershipPresenter> {
    const membership = await this.membershipRepository.findOneById(id);
    return new MembershipPresenter(membership);
  }

  async create(
    membershipData: CreateMembershipDTO,
  ): Promise<MembershipPresenter> {
    const newMembership = await this.membershipRepository.create(
      membershipData,
    );
    return new MembershipPresenter(newMembership);
  }

  async update(
    id: number,
    membershipData: UpdateMembershipDTO,
  ): Promise<MembershipPresenter> {
    const membership = await this.membershipRepository.update(
      id,
      membershipData,
    );
    return new MembershipPresenter(membership);
  }

  async activate(id: number): Promise<MembershipPresenter> {
    const updatedEnrollment = await this.update(id, {
      status: Status.ACTIVE,
    });
    return updatedEnrollment;
  }

  async deactivate(id: number): Promise<MembershipPresenter> {
    const updatedMembership = await this.update(id, {
      status: Status.DEACTIVE,
    });
    return updatedMembership;
  }

  async delete(id: number): Promise<void> {
    await this.membershipRepository.remove(id);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    return this.membershipRepository.statistics(start, end);
  }
}
