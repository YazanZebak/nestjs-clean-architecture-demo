import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/domain/entities/player.entity';
import { CreatePlayerDTO } from 'src/domain/models/player/dtos/create-player.dto';
import { UpdatePlayerDTO } from 'src/domain/models/player/dtos/update-player.dto';
import { IPlayerRepository } from 'src/domain/repositories/player-repository.interface';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { AccountRepository } from './account.repository';

@Injectable()
export class PlayerRepository implements IPlayerRepository {
  constructor(
    @InjectRepository(Player)
    private readonly playerEntityRepository: Repository<Player>,
    private readonly accountRepository: AccountRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ players: Player[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    let where = [];

    if (search) {
      where.push({ firstName: ILike(`%${search}%`) });
      where.push({ lastName: ILike(`%${search}%`) });
      where.push({ account: { email: ILike(`%${search}%`) } });
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

    const options: FindManyOptions<Player> = {
      where,
      skip,
      take: limit,
    };

    const [players, count] = await this.playerEntityRepository.findAndCount(
      options,
    );

    return { players: players, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.playerEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Player> {
    const player = await this.playerEntityRepository.findOne({
      where: { playerID: id },
    });

    if (!player || player === null) {
      this.exceptionService.NotFoundException({
        message: 'Player does not exsit',
        errorCode: 404,
      });
    }

    return player;
  }

  async findOneBy(
    property: keyof Player | string,
    value: any,
  ): Promise<Player> {
    const condition = {};
    condition[property] = value;
    return this.playerEntityRepository.findOne({ where: condition });
  }

  async create(playerData: CreatePlayerDTO): Promise<Player> {
    const account = await this.accountRepository.findOneById(
      playerData.accountID,
    );
    playerData.account = account;

    if (account.role !== AccountRole.PLAYER) {
      this.exceptionService.badRequestException({
        message: `Role Mismatch. The account is assigned the role '${account.role}', 
        but a player role is required in order to create a player.`,
        errorCode: 400,
      });
    }

    const player = this.playerEntityRepository.create(playerData);
    return this.playerEntityRepository.save(player);
  }

  async update(id: number, playerData: UpdatePlayerDTO): Promise<Player> {
    await this.playerEntityRepository.update(id, playerData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const player = await this.playerEntityRepository.findOne({
      where: { playerID: id },
      relations: ['account'],
    });
    await this.playerEntityRepository.softRemove(player);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    const rawData = await this.playerEntityRepository
      .createQueryBuilder('player')
      .select('DATE(player.createdAt)', 'date')
      .addSelect('COUNT(player.playerID)', 'count')
      .where('player.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(player.createdAt)')
      .orderBy('DATE(player.createdAt)', 'ASC')
      .getRawMany();

    return rawData.map((data) => ({
      date: data.date,
      count: +data.count,
    }));
  }
}
