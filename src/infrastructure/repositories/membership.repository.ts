import { Membership } from 'src/domain/entities/membership.entity';
import { CreateMembershipDTO } from 'src/domain/models/membership/dtos/create-membership.dto';
import { UpdateMembershipDTO } from 'src/domain/models/membership/dtos/update-membership.dto';
import { IMembershipRepository } from 'src/domain/repositories/membership-repository.interface';
import { PlayerRepository } from './player.repository';
import { GymRepository } from './gym.repository';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class MembershipRepository implements IMembershipRepository {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipEntityRepository: Repository<Membership>,
    private readonly playerRepository: PlayerRepository,
    private readonly gymRepository: GymRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ memberships: Membership[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    let where = [];

    if (search) {
      where.push({ gym: { name: ILike(`%${search}%`) } });
      where.push({ player: { firstName: ILike(`%${search}%`) } });
      where.push({ player: { lastName: ILike(`%${search}%`) } });
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

    const options: FindManyOptions<Membership> = {
      where,
      skip,
      take: limit,
      relations: ['gym', 'player'],
    };

    const [memberships, count] =
      await this.membershipEntityRepository.findAndCount(options);

    return { memberships: memberships, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.membershipEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Membership> {
    const membership = await this.membershipEntityRepository.findOne({
      where: { membershipID: id },
    });

    if (!membership || membership === null) {
      this.exceptionService.NotFoundException({
        message: 'Membership does not exsit',
        errorCode: 404,
      });
    }

    return membership;
  }

  findOneBy(
    property: keyof Membership | string,
    value: any,
  ): Promise<Membership> {
    const condition = {};
    condition[property] = value;
    return this.membershipEntityRepository.findOne({ where: condition });
  }

  async create(membershipData: CreateMembershipDTO): Promise<Membership> {
    const player = await this.playerRepository.findOneById(
      membershipData.playerID,
    );
    const gym = await this.gymRepository.findOneById(membershipData.gymID);

    membershipData.playerID = player.playerID;
    membershipData.gymID = gym.gymID;

    const startDate = new Date(membershipData.startDate);
    const endDate = new Date(membershipData.endDate);

    if (endDate < startDate) {
      this.exceptionService.badRequestException({
        message: 'End date must be after the start date',
        errorCode: 400,
      });
    }

    const newMembership =
      this.membershipEntityRepository.create(membershipData);

    return await this.membershipEntityRepository.save(newMembership);
  }

  async update(
    id: number,
    membershipData: UpdateMembershipDTO,
  ): Promise<Membership> {
    const membership = await this.membershipEntityRepository.findOne({
      where: { membershipID: id },
    });

    const startDate = new Date(membershipData.startDate);
    const endDate = new Date(membershipData.endDate);

    if (endDate >= startDate) {
      this.exceptionService.badRequestException({
        message: 'End date must be after the start date',
        errorCode: 400,
      });
    }

    await this.membershipEntityRepository.update(
      {
        membershipID: id,
        playerID: membership.playerID,
        gymID: membership.gymID,
      },
      membershipData,
    );

    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const membership = await this.membershipEntityRepository.findOne({
      where: { membershipID: id },
    });
    await this.membershipEntityRepository.remove(membership);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    const rawData = await this.membershipEntityRepository
      .createQueryBuilder('membership')
      .select('DATE(membership.createdAt)', 'date')
      .addSelect('COUNT(membership.membershipID)', 'count')
      .where('membership.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(membership.createdAt)')
      .orderBy('DATE(membership.createdAt)', 'ASC')
      .getRawMany();

    return rawData.map((data) => ({
      date: data.date,
      count: +data.count,
    }));
  }
}
