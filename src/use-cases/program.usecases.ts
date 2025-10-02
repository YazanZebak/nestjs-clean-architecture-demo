import { IException } from 'src/domain/adapters/exceptions.interface';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateProgramDTO } from 'src/domain/models/program/dtos/create-program.dto';
import { UpdateProgramDTO } from 'src/domain/models/program/dtos/update-program.dto';
import { ProgramPresenter } from 'src/domain/models/program/presenters/program.presenter';
import { IProgramRepository } from 'src/domain/repositories/program-repository.interface';
import { ITrainingRepository } from 'src/domain/repositories/training-repository.interface';

export class ProgramUseCases {
  constructor(
    private readonly programRepository: IProgramRepository,
    private readonly trainingRepository: ITrainingRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<ProgramPresenter>> {
    const response = await this.programRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const programs = response.programs.map(
      (program) => new ProgramPresenter(program),
    );

    return { data: programs, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.programRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<ProgramPresenter> {
    const program = await this.programRepository.findOneById(id);
    return new ProgramPresenter(program);
  }

  async create(programData: CreateProgramDTO): Promise<ProgramPresenter> {
    const newProgram = await this.programRepository.create(programData);
    return new ProgramPresenter(newProgram);
  }

  async update(
    id: number,
    programData: UpdateProgramDTO,
  ): Promise<ProgramPresenter> {
    const program = await this.programRepository.update(id, programData);
    return new ProgramPresenter(program);
  }

  async delete(id: number): Promise<void> {
    await this.programRepository.remove(id);
  }
}
