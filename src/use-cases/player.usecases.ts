import { IException } from 'src/domain/adapters/exceptions.interface';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreatePlayerDTO } from 'src/domain/models/player/dtos/create-player.dto';
import { UpdatePlayerDTO } from 'src/domain/models/player/dtos/update-player.dto';
import { PlayerPresenter } from 'src/domain/models/player/presenters/player.presenter';
import { IAccountRepository } from 'src/domain/repositories/account-repository.interface';
import { IPlayerRepository } from 'src/domain/repositories/player-repository.interface';

export class PlayerUseCases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly playerRepository: IPlayerRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<PlayerPresenter>> {
    const response = await this.playerRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const players = response.players.map(
      (player) => new PlayerPresenter(player),
    );

    return { data: players, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.playerRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<PlayerPresenter> {
    const player = await this.playerRepository.findOneById(id);
    return new PlayerPresenter(player);
  }

  async findOneByAccount(accountID: number): Promise<PlayerPresenter> {
    const player = await this.playerRepository.findOneBy('account', {
      accountID,
    });
    return new PlayerPresenter(player);
  }

  async create(playerData: CreatePlayerDTO): Promise<PlayerPresenter> {
    const newPlayer = await this.playerRepository.create(playerData);
    return new PlayerPresenter(newPlayer);
  }

  async update(
    id: number,
    playerData: UpdatePlayerDTO,
  ): Promise<PlayerPresenter> {
    const player = await this.playerRepository.update(id, playerData);
    return new PlayerPresenter(player);
  }

  async delete(id: number): Promise<void> {
    await this.playerRepository.remove(id);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    return this.playerRepository.statistics(start, end);
  }
}
