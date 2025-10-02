import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Gym } from 'src/domain/entities/gym.entity';
import { CreateGymDTO } from 'src/domain/models/gym/dtos/create-gym.dto';
import { UpdateGymDTO } from 'src/domain/models/gym/dtos/update-gym.dto';
import { IGymRepository } from 'src/domain/repositories/gym-repositroy.interface';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { AccountRepository } from './account.repository';

@Injectable()
export class GymRepository implements IGymRepository {
  constructor(
    @InjectRepository(Gym)
    private readonly gymEntityRepository: Repository<Gym>,
    private readonly accountRepository: AccountRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ gyms: Gym[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    let where = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ address: ILike(`%${search}%`) });
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
    const options: FindManyOptions<Gym> = {
      where,
      skip,
      take: limit,
    };

    const [gyms, count] = await this.gymEntityRepository.findAndCount(options);

    return { gyms: gyms, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.gymEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Gym> {
    const gym = await this.gymEntityRepository.findOne({
      where: { gymID: id },
      relations: ['coaches'],
    });

    if (!gym || gym === null) {
      this.exceptionService.NotFoundException({
        message: 'Gym does not exsit',
        errorCode: 404,
      });
    }

    return gym;
  }

  async findOneBy(property: keyof Gym | string, value: any): Promise<Gym> {
    const condition = {};
    condition[property] = value;
    return this.gymEntityRepository.findOne({ where: condition });
  }

  async create(gymData: CreateGymDTO): Promise<Gym> {
    const account = await this.accountRepository.findOneById(gymData.accountID);
    gymData.account = account;

    if (account.role !== AccountRole.GYM_ADMIN) {
      this.exceptionService.badRequestException({
        message: `Role Mismatch. The account is assigned the role '${account.role}', 
        but a gym admin role is required in order to create a gym.`,
        errorCode: 400,
      });
    }

    const gym = this.gymEntityRepository.create(gymData);
    return this.gymEntityRepository.save(gym);
  }

  async update(id: number, gymData: UpdateGymDTO): Promise<Gym> {
    await this.gymEntityRepository.update(id, gymData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const gym = await this.gymEntityRepository.findOne({
      where: { gymID: id },
      relations: ['account'],
    });
    await this.gymEntityRepository.softRemove(gym);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    const rawData = await this.gymEntityRepository
      .createQueryBuilder('gym')
      .select('DATE(gym.createdAt)', 'date')
      .addSelect('COUNT(gym.gymID)', 'count')
      .where('gym.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(gym.createdAt)')
      .orderBy('DATE(gym.createdAt)', 'ASC')
      .getRawMany();

    return rawData.map((data) => ({
      date: data.date,
      count: +data.count,
    }));
  }
}
