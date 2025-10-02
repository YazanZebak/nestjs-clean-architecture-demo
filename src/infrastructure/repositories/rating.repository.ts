import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'src/domain/entities/rating.entity';
import { CreateRatingDTO } from 'src/domain/models/rating/dtos/create-rating.dto';
import { UpdateRatingDTO } from 'src/domain/models/rating/dtos/update-rating.dto';
import { IRatingRepository } from 'src/domain/repositories/rating-repository.interface';
import { Repository, FindManyOptions } from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { TrainingRepository } from './training.repository';

@Injectable()
export class RatingRepository implements IRatingRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingEntityRepository: Repository<Rating>,
    private readonly trainingRepository: TrainingRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ ratings: Rating[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    let where = [];

    if (search) {
      //   where.push({ name: ILike(`%${search}%`) });
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

    const options: FindManyOptions<Rating> = {
      where,
      skip,
      take: limit,
    };

    const [ratings, count] = await this.ratingEntityRepository.findAndCount(
      options,
    );

    return { ratings: ratings, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.ratingEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Rating> {
    const rating = await this.ratingEntityRepository.findOne({
      where: { ratingID: id },
    });

    if (!rating || rating === null) {
      this.exceptionService.NotFoundException({
        message: 'Rating does not exsit',
        errorCode: 404,
      });
    }

    return rating;
  }

  async findOneBy(
    property: keyof Rating | string,
    value: any,
  ): Promise<Rating> {
    const condition = {};
    condition[property] = value;
    return this.ratingEntityRepository.findOne({ where: condition });
  }

  async create(ratingData: CreateRatingDTO): Promise<Rating> {
    const training = await this.trainingRepository.findOneById(
      ratingData.trainingID,
    );

    ratingData.training = training;

    const condition = {};
    condition['training.playerID'] = training.playerID;
    condition['training.coachID'] = training.coachID;

    const rate = await this.ratingEntityRepository.findOne({
      where: condition,
    });

    if (rate) {
      return this.update(rate.ratingID, { value: ratingData.value });
    }

    const rating = this.ratingEntityRepository.create(ratingData);
    return this.ratingEntityRepository.save(rating);
  }

  async update(id: number, ratingData: UpdateRatingDTO): Promise<Rating> {
    await this.ratingEntityRepository.update(id, ratingData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const rating = await this.ratingEntityRepository.findOne({
      where: { ratingID: id },
    });
    await this.ratingEntityRepository.softRemove(rating);
  }
}
