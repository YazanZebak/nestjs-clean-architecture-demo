import { Coach } from '../entities/coach.entity';
import { CreateCoachDTO } from '../models/coach/dtos/create-coach.dto';
import { UpdateCoachDTO } from '../models/coach/dtos/update-coach.dto';

export interface ICoachRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ coaches: Coach[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Coach>;

  findOneBy(property: keyof Coach, value: any): Promise<Coach | undefined>;

  create(coachData: CreateCoachDTO): Promise<Coach>;

  update(id: number, coachData: UpdateCoachDTO): Promise<Coach>;

  remove(id: number): Promise<void>;

  statistics(start: Date, end: Date): Promise<{ date: Date; count: number }[]>;
}
