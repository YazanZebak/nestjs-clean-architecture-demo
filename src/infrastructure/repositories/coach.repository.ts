import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coach } from 'src/domain/entities/coach.entity';
import { CreateCoachDTO } from 'src/domain/models/coach/dtos/create-coach.dto';
import { UpdateCoachDTO } from 'src/domain/models/coach/dtos/update-coach.dto';
import { ICoachRepository } from 'src/domain/repositories/coach-repository.interface';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { CategoryRepository } from './category.repository';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { AccountRepository } from './account.repository';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';

@Injectable()
export class CoachRepository implements ICoachRepository {
  constructor(
    @InjectRepository(Coach)
    private readonly coachEntityRepository: Repository<Coach>,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ coaches: Coach[]; count: number }> {
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

    const options: FindManyOptions<Coach> = {
      where,
      skip,
      take: limit,
    };

    const [coaches, count] = await this.coachEntityRepository.findAndCount(
      options,
    );

    return { coaches: coaches, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.coachEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Coach> {
    const coach = await this.coachEntityRepository.findOne({
      where: { coachID: id },
      relations: ['category', 'trainings', 'trainings.ratings'],
    });

    if (!coach || coach === null) {
      this.exceptionService.NotFoundException({
        message: 'Coach does not exsit',
        errorCode: 404,
      });
    }

    const newCoach: any = {
      ...coach,
      rating:
        coach.trainings
          .map((training) => training.ratings.map((rating) => +rating.value))
          .flat()
          .reduce((total, value) => total + value, 0) / coach.trainings.length,
    };
    delete newCoach.trainings;

    return newCoach;
  }

  async findOneBy(property: keyof Coach | string, value: any): Promise<Coach> {
    const condition = {};
    condition[property] = value;
    return this.coachEntityRepository.findOne({ where: condition });
  }

  async create(coachData: CreateCoachDTO): Promise<Coach> {
    const account = await this.accountRepository.findOneById(
      coachData.accountID,
    );

    const category = await this.categoryRepository.findOneById(
      coachData.categoryID,
    );

    if (account.role !== AccountRole.COACH) {
      this.exceptionService.badRequestException({
        message: `Role Mismatch. The account is assigned the role '${account.role}', 
        but a coach role is required in order to create a coach.`,
        errorCode: 400,
      });
    }

    coachData.account = account;
    coachData.category = category;
    const coach = this.coachEntityRepository.create(coachData);
    return this.coachEntityRepository.save(coach);
  }

  async update(id: number, coachData: UpdateCoachDTO): Promise<Coach> {
    if (coachData.categoryID) {
      const category = await this.categoryRepository.findOneById(
        coachData.categoryID,
      );
      delete coachData.categoryID;
      coachData.category = category;
    }
    await this.coachEntityRepository.update(id, coachData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const coach = await this.coachEntityRepository.findOne({
      where: { coachID: id },
      relations: ['account'],
    });
    await this.coachEntityRepository.softRemove(coach);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    const rawData = await this.coachEntityRepository
      .createQueryBuilder('coach')
      .select('DATE(coach.createdAt)', 'date')
      .addSelect('COUNT(coach.coachID)', 'count')
      .where('coach.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(coach.createdAt)')
      .orderBy('DATE(coach.createdAt)', 'ASC')
      .getRawMany();

    return rawData.map((data) => ({
      date: data.date,
      count: +data.count,
    }));
  }
}
