import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from 'src/domain/entities/program.entity';
import { CreateProgramDTO } from 'src/domain/models/program/dtos/create-program.dto';
import { UpdateProgramDTO } from 'src/domain/models/program/dtos/update-program.dto';
import { IProgramRepository } from 'src/domain/repositories/program-repository.interface';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { TrainingRepository } from './training.repository';

@Injectable()
export class ProgramRepository implements IProgramRepository {
  constructor(
    @InjectRepository(Program)
    private readonly programEntityRepository: Repository<Program>,
    private readonly trainingRepository: TrainingRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ programs: Program[]; count: number }> {
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

    const options: FindManyOptions<Program> = {
      where,
      skip,
      take: limit,
    };

    const [programs, count] = await this.programEntityRepository.findAndCount(
      options,
    );

    return { programs: programs, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.programEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Program> {
    const program = await this.programEntityRepository.findOne({
      where: { programID: id },
    });

    if (!program || program === null) {
      this.exceptionService.NotFoundException({
        message: 'Program does not exsit',
        errorCode: 404,
      });
    }

    return program;
  }

  async findOneBy(
    property: keyof Program | string,
    value: any,
  ): Promise<Program> {
    const condition = {};
    condition[property] = value;
    return this.programEntityRepository.findOne({ where: condition });
  }

  async create(programData: CreateProgramDTO): Promise<Program> {
    const training = await this.trainingRepository.findOneById(
      programData.trainingID,
    );

    programData.training = training;
    const program = this.programEntityRepository.create(programData);
    return this.programEntityRepository.save(program);
  }

  async update(id: number, programData: UpdateProgramDTO): Promise<Program> {
    await this.programEntityRepository.update(id, programData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const program = await this.programEntityRepository.findOne({
      where: { programID: id },
    });
    await this.programEntityRepository.softRemove(program);
  }
}
