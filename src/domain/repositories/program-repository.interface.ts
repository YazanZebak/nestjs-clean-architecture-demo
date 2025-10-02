import { Program } from '../entities/program.entity';
import { CreateProgramDTO } from '../models/program/dtos/create-program.dto';
import { UpdateProgramDTO } from '../models/program/dtos/update-program.dto';

export interface IProgramRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ programs: Program[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Program>;

  findOneBy(property: keyof Program, value: any): Promise<Program | undefined>;

  create(programData: CreateProgramDTO): Promise<Program>;

  update(id: number, programData: UpdateProgramDTO): Promise<Program>;

  remove(id: number): Promise<void>;
}
