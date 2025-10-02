import { InjectRepository } from '@nestjs/typeorm';
import { Training } from 'src/domain/entities/training.entity';
import { CreateTrainingDTO } from 'src/domain/models/training/dtos/create-training.dto';
import { UpdateTrainingDTO } from 'src/domain/models/training/dtos/update-training.dto';
import { ITrainingRepository } from 'src/domain/repositories/training-repository.interface';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { CoachRepository } from './coach.repository';
import { PlayerRepository } from './player.repository';
import { PusherService } from '../services/pusher/pusher.service';

export class TrainingRepository implements ITrainingRepository {
  constructor(
    @InjectRepository(Training)
    private readonly trainingEntityRepository: Repository<Training>,
    private readonly playerRepository: PlayerRepository,
    private readonly coachRepository: CoachRepository,
    private readonly exceptionService: ExceptionsService,
    private readonly pusherService: PusherService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ trainings: Training[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    let where = [];

    if (search) {
      where.push({ coach: { firstName: ILike(`%${search}%`) } });
      where.push({ coach: { lastName: ILike(`%${search}%`) } });
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

    const options: FindManyOptions<Training> = {
      where,
      skip,
      take: limit,
    };

    const [trainings, count] = await this.trainingEntityRepository.findAndCount(
      options,
    );

    return { trainings: trainings, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.trainingEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Training> {
    const training = await this.trainingEntityRepository.findOne({
      where: { trainingID: id },
    });

    if (!training || training === null) {
      this.exceptionService.NotFoundException({
        message: 'Training does not exsit',
        errorCode: 404,
      });
    }

    return training;
  }

  findOneBy(property: keyof Training | string, value: any): Promise<Training> {
    const condition = {};
    condition[property] = value;
    return this.trainingEntityRepository.findOne({ where: condition });
  }

  async create(trainingData: CreateTrainingDTO): Promise<Training> {
    const player = await this.playerRepository.findOneById(
      trainingData.playerID,
    );
    const coach = await this.coachRepository.findOneById(trainingData.coachID);

    trainingData.playerID = player.playerID;
    trainingData.coachID = coach.coachID;

    this.pusherService.triggerEvent(
      `notification-${coach.account.accountID}`,
      'training',
      {
        message: `New Training Request From ${
          player.firstName + player.lastName
        }`,
      },
    );

    const newTraining = this.trainingEntityRepository.create(trainingData);

    return await this.trainingEntityRepository.save(newTraining);
  }

  async update(id: number, trainingData: UpdateTrainingDTO): Promise<Training> {
    const training = await this.trainingEntityRepository.findOne({
      where: { trainingID: id },
    });

    await this.trainingEntityRepository.update(
      {
        trainingID: id,
        playerID: training.playerID,
        coachID: training.coachID,
      },
      trainingData,
    );

    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const training = await this.trainingEntityRepository.findOne({
      where: { trainingID: id },
    });
    await this.trainingEntityRepository.remove(training);
  }
}
