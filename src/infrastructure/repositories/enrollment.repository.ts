import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from 'src/domain/entities/enrollment.entity';
import { IEnrollmentRepository } from 'src/domain/repositories/enrollment-repository.interface';
import { CoachRepository } from './coach.repository';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { GymRepository } from './gym.repository';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { CreateEnrollmentDTO } from 'src/domain/models/enrollment/dtos/create-enrollment.dto';
import { UpdateEnrollmentDTO } from 'src/domain/models/enrollment/dtos/update-enrollment.dto';

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentEntityRepository: Repository<Enrollment>,
    private readonly coachRepository: CoachRepository,
    private readonly gymRepository: GymRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ enrollments: Enrollment[]; count: number }> {
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
      where.push({ coach: { firstName: ILike(`%${search}%`) } });
      where.push({ coach: { lastName: ILike(`%${search}%`) } });
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

    const options: FindManyOptions<Enrollment> = {
      where,
      skip,
      take: limit,
      relations: ['gym', 'coach'],
    };

    const [enrollments, count] =
      await this.enrollmentEntityRepository.findAndCount(options);

    return { enrollments: enrollments, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.enrollmentEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentEntityRepository.findOne({
      where: { enrollmentID: id },
    });

    if (!enrollment || enrollment === null) {
      this.exceptionService.NotFoundException({
        message: 'Enrollment does not exsit',
        errorCode: 404,
      });
    }

    return enrollment;
  }

  findOneBy(
    property: keyof Enrollment | string,
    value: any,
  ): Promise<Enrollment> {
    const condition = {};
    condition[property] = value;
    return this.enrollmentEntityRepository.findOne({ where: condition });
  }

  async create(enrollmentData: CreateEnrollmentDTO): Promise<Enrollment> {
    const coach = await this.coachRepository.findOneById(
      enrollmentData.coachID,
    );
    const gym = await this.gymRepository.findOneById(enrollmentData.gymID);

    enrollmentData.coachID = coach.coachID;
    enrollmentData.gymID = gym.gymID;

    const newMembership =
      this.enrollmentEntityRepository.create(enrollmentData);

    return await this.enrollmentEntityRepository.save(newMembership);
  }

  async update(
    id: number,
    enrollmentData: UpdateEnrollmentDTO,
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentEntityRepository.findOne({
      where: { enrollmentID: id },
    });

    await this.enrollmentEntityRepository.update(
      {
        enrollmentID: id,
        coachID: enrollment.coachID,
        gymID: enrollment.gymID,
      },
      enrollmentData,
    );

    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const enrollment = await this.enrollmentEntityRepository.findOne({
      where: { enrollmentID: id },
    });
    await this.enrollmentEntityRepository.remove(enrollment);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    const rawData = await this.enrollmentEntityRepository
      .createQueryBuilder('enrollment')
      .select('DATE(enrollment.createdAt)', 'date')
      .addSelect('COUNT(enrollment.enrollmentID)', 'count')
      .where('enrollment.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(enrollment.createdAt)')
      .orderBy('DATE(enrollment.createdAt)', 'ASC')
      .getRawMany();

    return rawData.map((data) => ({
      date: data.date,
      count: +data.count,
    }));
  }
}
